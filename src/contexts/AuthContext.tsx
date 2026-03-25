import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, User, CalculatorData } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  calculatorData: CalculatorData | null;
  isLoading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => void;
  updateCalculatorData: (data: Partial<CalculatorData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [calculatorData, setCalculatorData] = useState<CalculatorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedEmail = localStorage.getItem('user_email');
      if (storedEmail) {
        const timeoutId = setTimeout(() => {
          console.warn('Auth loading timeout - clearing session');
          localStorage.removeItem('user_email');
          setUser(null);
          setIsLoading(false);
        }, 10000);

        await loadUser(storedEmail);
        clearTimeout(timeoutId);
      } else {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const loadUser = async (email: string) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (userError) {
        console.error('Error fetching user:', userError);
        setIsLoading(false);
        return;
      }

      let currentUser = userData;

      if (!currentUser) {
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({ email, last_sign_in: new Date().toISOString() })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user:', insertError);
          setIsLoading(false);
          return;
        }
        currentUser = newUser;
      } else {
        await supabase
          .from('users')
          .update({ last_sign_in: new Date().toISOString() })
          .eq('id', currentUser.id);
      }

      setUser(currentUser);

      const { data: calcData, error: calcError } = await supabase
        .from('calculator_data')
        .select('*')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      if (calcError) {
        console.error('Error fetching calculator data:', calcError);
        setIsLoading(false);
        return;
      }

      if (!calcData) {
        const { data: newCalcData, error: insertCalcError } = await supabase
          .from('calculator_data')
          .insert({ user_id: currentUser.id })
          .select()
          .single();

        if (insertCalcError) {
          console.error('Error creating calculator data:', insertCalcError);
          setIsLoading(false);
          return;
        }
        setCalculatorData(newCalcData);
      } else {
        setCalculatorData(calcData);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      localStorage.removeItem('user_email');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string) => {
    localStorage.setItem('user_email', email);
    await loadUser(email);
  };

  const signOut = () => {
    localStorage.removeItem('user_email');
    setUser(null);
    setCalculatorData(null);
  };

  const updateCalculatorData = async (data: Partial<CalculatorData>) => {
    if (!user || !calculatorData) return;

    try {
      const { data: updatedData, error } = await supabase
        .from('calculator_data')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setCalculatorData(updatedData);
    } catch (error) {
      console.error('Error updating calculator data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, calculatorData, isLoading, signIn, signOut, updateCalculatorData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
