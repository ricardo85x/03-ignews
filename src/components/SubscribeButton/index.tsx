import { useSession, signIn } from 'next-auth/client'
import { useRouter } from 'next/router';
import { SessionProps } from "../../pages/api/auth/_interface"
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss'

interface SubscribeButtonProps {
    priceId: string;
}

export function SubscribeButton( { priceId } : SubscribeButtonProps ) {

    const [session] = useSession() as [SessionProps | null | undefined, boolean]
    const router = useRouter()

    async function handleSubscribe() {

        if (!session) {
            signIn('github')
            return;
        }

        if (session.activeSubscription) {
            
            router.push('/posts')
            return;
        }

        try {
            const response = await api.post('/subscribe')

            const { sessionId } = response.data

            const stripe = await getStripeJs()

            await stripe.redirectToCheckout({sessionId})

        } catch (err) {

            alert(err.message)
        }




    }

    return (
        <button 
            type="button"
            className={styles.subscribeButton}
            onClick={handleSubscribe}
        >
            Subscribe now
        </button>
    )
}
