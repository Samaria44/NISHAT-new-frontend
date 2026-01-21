import React, { useState } from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import "./contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await axios.post(`${API_BASE_URL}/contact`, formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="contact-page">
      {/* Map */}
      <div className="map-container">
        <iframe
          title="Nishat Mills Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3320.556824317089!2d74.24200501510214!3d31.50340898145006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391905f6bca6efb1%3A0x3b0b44e04b02e90c!2sFerozepur%20Road%2C%20Lahore%2C%20Pakistan!5e0!3m2!1sen!2s!4v1698284378331!5m2!1sen!2s"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>

      {/* Main Content */}
      <div className="contact-container">
        {/* Left: Contact Form */}
        <div className="contact-left">
          <h2>DROP US A LINE</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name (required)"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email (required)"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Your Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
            ></textarea>
            <button type="submit">Send</button>
            {submitted && (
              <p className="success-msg">Your message has been sent!</p>
            )}
            {errorMsg && (
              <p className="error-msg" style={{ color: "red" }}>{errorMsg}</p>
            )}
          </form>
        </div>

        {/* Right: Contact Info */}
        <div className="contact-right">
          <h2>CONTACT INFORMATION</h2>
          <p>
            We love to hear from you on our customer service, merchandise,
            website or any topics you want to share with us. Your comments and
            suggestions will be appreciated.
          </p>
          <div className="contact-info">
            <p><FaMapMarkerAlt /> 21 Km Ferozpur Road, Lahore, Pakistan.</p>
            <p><FaPhone /> +92 42 111 647 428</p>
            <p><FaEnvelope /> nishatonline@nishatmills.com</p>
            <p><FaClock /> Everyday 9:00 AM to 10:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
}
