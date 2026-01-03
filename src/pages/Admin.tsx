import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  Users, 
  CreditCard, 
  ArrowLeft, 
  Search, 
  MoreHorizontal,
  Check,
  X,
  Clock,
  Heart
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import FloatingShapes from '@/components/wellness/FloatingShapes';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  display_name: string | null;
  created_at: string;
  last_questionnaire_date: string | null;
  last_score: number | null;
}

interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  user_email?: string | null;
  user_name?: string | null;
  payment_type: string;
  created_at: string;
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'payments'>('users');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setUsers(data || []);
      } else {
        const { data: paymentsData, error: paymentsError } = await supabase
          .from('payments')
          .select('*')
          .order('created_at', { ascending: false });

        if (paymentsError) throw paymentsError;

        // Fetch user profiles separately
        const userIds = [...new Set((paymentsData || []).map(p => p.user_id))];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, email, display_name')
          .in('user_id', userIds);

        const profilesMap = new Map(
          (profilesData || []).map(p => [p.user_id, p])
        );

        const paymentsWithProfiles = (paymentsData || []).map(p => ({
          ...p,
          user_email: profilesMap.get(p.user_id)?.email,
          user_name: profilesMap.get(p.user_id)?.display_name,
        }));

        setPayments(paymentsWithProfiles);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (paymentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .update({ status: newStatus })
        .eq('id', paymentId);

      if (error) throw error;

      setPayments((prev) =>
        prev.map((p) => (p.id === paymentId ? { ...p, status: newStatus } : p))
      );

      toast({
        title: 'Success',
        description: `Payment status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating payment:', error);
      toast({
        title: 'Error',
        description: 'Failed to update payment status',
        variant: 'destructive',
      });
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.display_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPayments = payments.filter(
    (p) =>
      p.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.payment_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: 'bg-wellness-green/20 text-wellness-green',
      pending: 'bg-wellness-yellow/20 text-wellness-yellow',
      failed: 'bg-wellness-red/20 text-wellness-red',
      refunded: 'bg-muted text-muted-foreground',
    };

    const icons: Record<string, React.ReactNode> = {
      completed: <Check className="w-3 h-3" />,
      pending: <Clock className="w-3 h-3" />,
      failed: <X className="w-3 h-3" />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          styles[status] || 'bg-muted text-muted-foreground'
        }`}
      >
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Admin Panel | ARE YOU OK?</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen gradient-hero relative overflow-hidden">
        <FloatingShapes />

        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-40 px-4 py-4 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary" fill="currentColor" />
                </div>
                <span className="font-bold text-lg text-foreground">Admin Panel</span>
              </div>
            </div>
          </div>
        </header>

        <main className="relative z-10 pt-24 pb-12 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === 'users'
                    ? 'bg-primary text-primary-foreground shadow-glow'
                    : 'bg-card text-muted-foreground hover:bg-muted'
                }`}
              >
                <Users className="w-5 h-5" />
                Users
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('payments')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === 'payments'
                    ? 'bg-primary text-primary-foreground shadow-glow'
                    : 'bg-card text-muted-foreground hover:bg-muted'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                Payments
              </motion.button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-border bg-card focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            {/* Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="wellness-card overflow-hidden"
            >
              {activeTab === 'users' ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Last Check-in</TableHead>
                      <TableHead>Last Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.display_name || 'Anonymous'}
                          </TableCell>
                          <TableCell>{user.email || '-'}</TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {user.last_questionnaire_date
                              ? new Date(user.last_questionnaire_date).toLocaleDateString()
                              : '-'}
                          </TableCell>
                          <TableCell>
                            {user.last_score !== null ? (
                              <span
                                className={`font-medium ${
                                  user.last_score <= 30
                                    ? 'text-wellness-green'
                                    : user.last_score <= 60
                                    ? 'text-wellness-yellow'
                                    : user.last_score <= 80
                                    ? 'text-wellness-orange'
                                    : 'text-wellness-red'
                                }`}
                              >
                                {user.last_score}
                              </span>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No payments found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">
                            {payment.user_name || payment.user_email || 'Unknown'}
                          </TableCell>
                          <TableCell className="capitalize">{payment.payment_type}</TableCell>
                          <TableCell>
                            {payment.currency} {payment.amount.toFixed(2)}
                          </TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          <TableCell>
                            {new Date(payment.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => updatePaymentStatus(payment.id, 'completed')}
                                >
                                  <Check className="w-4 h-4 mr-2" />
                                  Mark Completed
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => updatePaymentStatus(payment.id, 'pending')}
                                >
                                  <Clock className="w-4 h-4 mr-2" />
                                  Mark Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => updatePaymentStatus(payment.id, 'refunded')}
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Mark Refunded
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Admin;
