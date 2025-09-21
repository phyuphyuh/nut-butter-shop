import { useState } from "react";
import type { FormEvent } from "react";
import "./Contact.scss";

const Contact: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!message.trim()) newErrors.message = "Message is required.";
    return newErrors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);

    console.log("Form submitted:", { name, email, message });
  };

  if (submitted) {
    return (
      <div className="contact-container">
        <div className="contact-confirmation">
          <h2>Hey there, we got your message! 🎉</h2>
          <p>We’ll be in touch soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-container">
      <form className="contact-form" onSubmit={handleSubmit}>
        <h2>Your Feedback is <em>Very</em> Important to Us.</h2>

        <div className="contact-form-row">
          <input
            type="text"
            className="contact-input"
            placeholder="Enter your name*"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div className="contact-form-row">
          <input
            type="email"
            className="contact-input"
            placeholder="Enter your email*"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="contact-form-row">
          <textarea
            className="contact-textarea"
            placeholder="Suggestion*"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          {errors.message && <p className="error">{errors.message}</p>}
        </div>

        <button type="submit" className="contact-submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Contact;
