import { useEffect, useRef, useState } from 'react';
import { Battery, Signal, MessageSquare, Users, Info, UserRound } from 'lucide-react';
import './phone-inspect.css';

export function PhoneInspectDialog({ inspect, onClose }) {
  const [active, setActive] = useState(inspect.cards[0].id);
  const [seen, setSeen] = useState([inspect.cards[0].id]);
  const dialog = useRef(null);
  const done = inspect.cards.every(card => seen.includes(card.id));
  const card = inspect.cards.find(card => card.id === active);
  const open = id => { setActive(id); setSeen(previous => [...new Set([...previous, id])]); };
  useEffect(() => {
    const previous = document.activeElement;
    dialog.current?.querySelector('[role="tab"][aria-selected="true"]')?.focus();
    return () => previous?.focus();
  }, []);
  function keys(event) {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); if (done) onClose(); return; }
    if (event.target.getAttribute('role') === 'tab' && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const index = inspect.cards.findIndex(card => card.id === active);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? inspect.cards.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + inspect.cards.length) % inspect.cards.length;
      open(inspect.cards[next].id);
      requestAnimationFrame(() => dialog.current?.querySelectorAll('[role="tab"]')[next]?.focus());
      return;
    }
    if (event.key !== 'Tab') return;
    const controls = [...dialog.current.querySelectorAll('button:not(:disabled):not([tabindex="-1"]),[role="tabpanel"]')];
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
  return <div className="ch5-modal phone-inspect-modal"><section ref={dialog} className="phone-inspect-dialog" role="dialog" aria-modal="true" aria-labelledby="ch7-phone-title" onKeyDown={keys}>
    <div className="phone-status" aria-hidden="true"><b>AN</b><span className="phone-speaker"/><span><Signal size={15}/><Battery size={20}/></span></div>
    <header className="phone-app-header"><span className="phone-app-icon" aria-hidden="true">{card.contacts ? <Users size={22}/> : <MessageSquare size={22}/>}</span><div><p>ĐIỆN THOẠI CỦA AN · MÔ PHỎNG</p><h3 id="ch7-phone-title">{card.label}</h3></div></header>
    <main className="phone-screen" role="tabpanel" id={`phone-panel-${active}`} aria-labelledby={`phone-tab-${active}`} tabIndex={0}>
      {!card.contacts ? <div className="phone-conversation"><div className="phone-sender"><span className="phone-avatar" aria-hidden="true"><UserRound size={24}/></span><b>{card.sender}</b><small>{card.senderNote}</small></div><p className="phone-message-time">Tin vừa nhận</p><div className="phone-message-bubble" data-phone-message>{card.message}</div><p className="phone-message-context"><Info size={16} aria-hidden="true"/><span>{card.context}</span></p>
        {inspect.shared && <aside className="phone-notice"><b>{inspect.shared.label}</b>{inspect.shared.items.map(item => <p key={item}>{item}</p>)}</aside>}
      </div> : <div className="phone-contacts"><p className="phone-contacts-intro">An đã có thông tin của những nơi này từ trước:</p><ul aria-label="Danh sách liên hệ">{card.contacts.map((contact, index) => <li key={contact.id} data-phone-contact={contact.id}><span className={`phone-contact-avatar phone-contact-avatar-${index}`} aria-hidden="true">{index === 2 ? 'TR' : 'BH'}</span><div><h4>{contact.name}</h4><p>{contact.detail}</p></div></li>)}</ul><aside className="phone-contact-note"><Info size={18} aria-hidden="true"/><p>{card.note}</p></aside></div>}
    </main>
    <nav className="phone-tabs" role="tablist" aria-label="Mục điện thoại">{inspect.cards.map(item => <button key={item.id} id={`phone-tab-${item.id}`} role="tab" aria-label={item.label} aria-selected={active === item.id} aria-controls={`phone-panel-${item.id}`} tabIndex={active === item.id ? 0 : -1} onClick={() => open(item.id)}>{item.contacts ? <Users size={21} aria-hidden="true"/> : <MessageSquare size={21} aria-hidden="true"/>}<span>{item.label}</span>{seen.includes(item.id) && <small>✓ Đã xem</small>}</button>)}</nav>
    <footer className="phone-inspect-footer"><p aria-live="polite">{done ? 'Đã xem cả hai mục.' : 'Mở danh bạ để xem có thể hỏi ai nhé.'}</p><button aria-label="Đóng" disabled={!done} onClick={onClose}>Xong rồi →</button></footer>
    <div className="phone-home-indicator" aria-hidden="true"/>
  </section></div>;
}
