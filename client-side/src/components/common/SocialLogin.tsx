import useAuth from '../../contexts/AuthProvider';
import Button from '../ui/Button';

import { motion } from 'framer-motion';

export default function SocialLogin() {
    const Auth = useAuth();

    return (
        <motion.div
            className="flex gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
        >
            <Button
                onClick={Auth.googleSignUp}
                variant="outline"
                label="Google"
                aria-label="Sign up with Google"
                icon={<img src="/icons/google.svg" alt="Google" className="h-5 w-5" />}
            />

            <Button
                onClick={Auth.facebookSignUp}
                variant="secondary"
                label="Facebook"
                aria-label="Sign up with Facebook"
                icon={
                    <img src="/icons/facebook.svg" alt="Facebook" className="h-5 w-5" />
                }
            />
        </motion.div>
    );
}
