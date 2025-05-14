
import '../styles/globals.css'; 
import './zone/zone.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import FloatingRegisterButton from '@/components/FloatRegisterButton';


export default function App({ Component, pageProps }) {
  return (
    <div>
      <Component {...pageProps} />
      <FloatingRegisterButton />
    </div>
  );
}

