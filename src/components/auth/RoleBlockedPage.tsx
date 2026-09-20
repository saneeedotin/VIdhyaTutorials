import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MVButton } from '../ui/MVButton';

interface RoleBlockedPageProps {
  userRole: string;
}

export function RoleBlockedPage({ userRole }: RoleBlockedPageProps) {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 rounded-full bg-danger/15 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-danger" />
        </div>

        <h1 className="text-3xl font-bold text-white font-[var(--font-display)] mb-3">
          Access Denied
        </h1>

        <p className="text-muted text-sm mb-2 font-[var(--font-sans)]">
          Your role <span className="text-accent font-mono text-xs bg-surface px-2 py-0.5 rounded">{userRole}</span> does not have permission to view this page.
        </p>

        <p className="text-muted text-xs mb-8">
          If you believe this is an error, contact your administrator.
        </p>

        <Link to="/">
          <MVButton variant="primary" arrow>
            Back to Home
          </MVButton>
        </Link>
      </motion.div>
    </div>
  );
}
