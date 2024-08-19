import Home from '../components/Home';

export default function GalleryPage({ user, hasSubscription, onSubscribe }) {
  return <Home user={user} hasSubscription={hasSubscription} onSubscribe={onSubscribe} />;
}
