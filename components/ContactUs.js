import React, { useState } from 'react';

const ContactUs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [status, setStatus] = useState(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setStatus(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'Message sent successfully!' });
        setFormData({ name: '', message: '' });
      } else {
        setStatus({ type: 'error', message: result.error || 'Failed to send message.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'An unexpected error occurred.' });
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-r bg-black text-black min-h-screen w-full">
      <div className="text-center w-full">
        <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
        <p className="text-lg text-white mb-6">
          Have any questions? Feel free to reach out to us!
        </p>
        <button
          className="bg-gray-100 text-black px-6 py-2 rounded-lg shadow-md hover:bg-gray-900 hover:text-white focus:outline-none"
          onClick={openModal}
        >
          Contact Us
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={closeModal}
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Get in Touch</h2>
            {status && (
              <div
                className={`mb-4 text-center text-${
                  status.type === 'success' ? 'green' : 'red'
                }-600`}
              >
                {status.message}
              </div>
            )}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                  rows="4"
                  placeholder="Your Message"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-900 focus:outline-none w-full"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactUs;
