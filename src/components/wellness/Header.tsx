import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import AuthDialog from '@/components/auth/AuthDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-40 px-4 py-4"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary" fill="currentColor" />
            </div>
            <span className="font-bold text-lg text-foreground">ARE YOU OK?</span>
          </motion.div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground hidden sm:inline">
                    {user.email?.split('@')[0]}
                  </span>
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAuthDialog(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground font-medium shadow-glow hover:shadow-lg transition-all"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Login</span>
            </motion.button>
          )}
        </div>
      </motion.header>

      <AuthDialog isOpen={showAuthDialog} onClose={() => setShowAuthDialog(false)} />
    </>
  );
};

export default Header;
