'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// Rodízio: o servidor (/api/whatsapp) alterna entre estes números a cada acesso.
const WHATSAPP_PHONES = ['553199872948', '553798317033'];

const WhatsAppContext = createContext({
  phone: WHATSAPP_PHONES[0],
  buildLink: () => '',
});

export function WhatsAppProvider({ children }) {
  const [phone, setPhone] = useState(WHATSAPP_PHONES[0]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/whatsapp', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('bad status'))))
      .then((data) => {
        if (!cancelled && data?.phone) setPhone(data.phone);
      })
      .catch(() => {
        if (!cancelled) {
          setPhone(WHATSAPP_PHONES[Math.floor(Math.random() * WHATSAPP_PHONES.length)]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const buildLink = ({ nome, cidade, telefone }) => {
    const n = nome ? nome.trim() : '[NOME]';
    const c = cidade ? cidade.trim() : '[CIDADE]';
    const t = telefone || '[TELEFONE]';
    const message = `Olá! Sou ${n}. Quero falar com um especialista. Moro em ${c} e meu telefone é ${t}`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <WhatsAppContext.Provider value={{ phone, buildLink }}>
      {children}
    </WhatsAppContext.Provider>
  );
}

export function useWhatsApp() {
  return useContext(WhatsAppContext);
}
