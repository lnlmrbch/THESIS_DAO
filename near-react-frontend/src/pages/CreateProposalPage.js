// src/pages/CreateProposalPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from "react-router-dom";
import {
  FaHeading,
  FaAlignLeft,
  FaLink,
  FaMoneyBillWave,
  FaUserCircle,
  FaFolderOpen,
  FaCalendarAlt,
  FaUserShield,
  FaPlusCircle,
  FaArrowLeft,
  FaInfoCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { providers } from "near-api-js";

export default function CreateProposalPage({ selector, accountId, contractId }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    link: "",
    tags: [],
    amount: "",
    target_account: "",
    category: "",
    deadline: null,
    required_role: "",
  });
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const txHash = params.get("transactionHashes");
  
    if (txHash) {
      navigate("/proposals", { replace: true });
    }
  }, [location, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Titel ist erforderlich";
    if (!form.description.trim()) newErrors.description = "Beschreibung ist erforderlich";
    if (form.amount && isNaN(parseFloat(form.amount))) newErrors.amount = "Ungültiger Betrag";
    if (form.link && !form.link.startsWith("http")) newErrors.link = "Link muss mit http:// oder https:// beginnen";
    if (form.deadline && form.deadline < new Date()) newErrors.deadline = "Deadline muss in der Zukunft liegen";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleDateChange = (date) => {
    setForm((prev) => ({ ...prev, deadline: date }));
    if (errors.deadline) {
      setErrors(prev => ({ ...prev, deadline: null }));
    }
  };

  const createProposal = async () => {
    if (!validateForm()) {
      setStatus("❌ Bitte korrigieren Sie die markierten Felder.");
      return;
    }

    setIsLoading(true);
    setStatus(null);

    try {
      const wallet = await selector.wallet();
      const tx = await wallet.signAndSendTransaction({
        signerId: accountId,
        receiverId: contractId,
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "create_proposal",
              args: {
                title: form.title.trim(),
                description: form.description.trim(),
                link: form.link.trim() || null,
                tags: form.tags || [],
                amount: form.amount ? BigInt(parseFloat(form.amount) * 1e24).toString() : null,
                target_account: form.target_account.trim() || null,
                category: form.category || null,
                deadline: form.deadline ? Math.floor(form.deadline.getTime() / 1000) : null,
                required_role: form.required_role || null,
              },
              gas: "30000000000000",
              deposit: "10000000000000000000000",
            },
          },
        ],
      });

      if (tx?.transaction?.hash) {
        setStatus("✅ Proposal erfolgreich erstellt! Warte auf Bestätigung...");
        
        // Warte auf die Transaktionsbestätigung
        const provider = new providers.JsonRpcProvider("https://rpc.testnet.near.org");
        await provider.txStatus(tx.transaction.hash, accountId);

        setStatus("✅ Proposal wurde erfolgreich erstellt!");
        setTimeout(() => {
          navigate("/proposals", { replace: true });
        }, 2000);
      }
    } catch (err) {
      console.error("Fehler beim Erstellen des Proposals:", err);
      if (err.message?.includes("Nur Community- oder Core-Mitglieder")) {
        setStatus("❌ Nur Community- oder Core-Mitglieder dürfen Proposals erstellen.");
      } else {
        setStatus("❌ Fehler beim Erstellen des Proposals. Bitte versuchen Sie es später erneut.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { name: "title", label: "Titel", icon: <FaHeading />, description: "Kurzer, prägnanter Titel deines Proposals.", type: "text", required: true },
    { name: "description", label: "Beschreibung", icon: <FaAlignLeft />, description: "Detaillierte Beschreibung deines Vorschlags.", type: "textarea", required: true },
    { name: "link", label: "Externer Link", icon: <FaLink />, description: "Optionaler Verweis auf weiterführende Inhalte.", type: "text" },
    { name: "amount", label: "Betrag (in THESISDAO)", icon: <FaMoneyBillWave />, description: "Gewünschter Betrag für dieses Proposal.", type: "number", min: "0", step: "0.01" },
    { name: "target_account", label: "Zielaccount", icon: <FaUserCircle />, description: "Konto, an den das Geld ggf. gesendet wird.", type: "text" },
    {
      name: "category", label: "Kategorie", icon: <FaFolderOpen />, description: "Wähle einen Bereich, zu dem dein Proposal gehört.",
      type: "select", options: [
        { value: "", label: "-- Bitte wählen --" },
        { value: "development", label: "Entwicklung" },
        { value: "community", label: "Community" },
        { value: "events", label: "Events" },
        { value: "marketing", label: "Marketing" },
        { value: "governance", label: "Governance" },
      ],
    },
    {
      name: "deadline", label: "Deadline", icon: <FaCalendarAlt />, description: "Bis wann darf abgestimmt werden?",
      type: "date",
    },
    {
      name: "required_role", label: "Benötigte Rolle", icon: <FaUserShield />, description: "Welche Rolle darf abstimmen?",
      type: "select", options: [
        { value: "", label: "-- Keine Einschränkung --" },
        { value: "core", label: "Core" },
        { value: "community", label: "Community" }
      ],
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-black"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/proposals")}
                className="text-gray-600 hover:text-[#6B46C1] transition-colors"
              >
                <FaArrowLeft className="w-5 h-5" />
              </motion.button>
              <h1 className="text-2xl font-bold text-gray-900">Neuen Proposal erstellen</h1>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100"
          >
            <div className="p-8 space-y-6">
              {fields.map(({ name, label, icon, description, type, options, required, min, step }, index) => (
                <motion.div 
                  key={name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <span className="text-[#6B46C1]">{icon}</span>
                    {label}
                    {required && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-red-500"
                      >
                        *
                      </motion.span>
                    )}
                  </label>
                  {type === "textarea" ? (
                    <motion.textarea
                      whileFocus={{ scale: 1.01 }}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      rows={4}
                      className={`w-full p-4 bg-gray-50 border ${errors[name] ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-[#6B46C1] focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400`}
                      placeholder={description}
                    />
                  ) : type === "select" ? (
                    <motion.select
                      whileFocus={{ scale: 1.01 }}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      className={`w-full p-4 bg-gray-50 border ${errors[name] ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-[#6B46C1] focus:border-transparent transition-all duration-200 text-gray-800`}
                    >
                      {options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </motion.select>
                  ) : type === "date" ? (
                    <motion.div whileFocus={{ scale: 1.01 }}>
                      <DatePicker
                        selected={form.deadline}
                        onChange={handleDateChange}
                        className={`w-full p-4 bg-gray-50 border ${errors[name] ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-[#6B46C1] focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400`}
                        placeholderText="Datum auswählen"
                        dateFormat="dd.MM.yyyy"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        minDate={new Date()}
                      />
                    </motion.div>
                  ) : (
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type={type}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      min={min}
                      step={step}
                      className={`w-full p-4 bg-gray-50 border ${errors[name] ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-[#6B46C1] focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400`}
                      placeholder={description}
                    />
                  )}
                  <AnimatePresence>
                    {errors[name] ? (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-xs text-red-500 font-medium"
                      >
                        {errors[name]}
                      </motion.p>
                    ) : (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-gray-500"
                      >
                        {description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={createProposal}
                disabled={isLoading}
                className={`w-full py-4 bg-gradient-to-r from-[#6B46C1] to-[#805AD5] text-white font-medium rounded-xl transition-all duration-200 flex justify-center items-center gap-2 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-[#5931aa] hover:to-[#6B46C1] hover:shadow-lg'
                }`}
              >
                {isLoading ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <FaPlusCircle className="w-5 h-5" />
                    <span>Proposal einreichen</span>
                  </>
                )}
              </motion.button>
              <AnimatePresence>
                {status && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`text-sm mt-3 text-center font-medium ${status.includes('❌') ? 'text-red-500' : 'text-green-500'}`}
                  >
                    {status}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Hinweise</h2>
              <ul className="space-y-4 text-sm text-gray-600">
                <li className="flex items-start gap-3">
                  <FaInfoCircle className="text-[#6B46C1] mt-1 flex-shrink-0" />
                  <span>Stelle sicher, dass dein Proposal klar und präzise formuliert ist.</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaInfoCircle className="text-[#6B46C1] mt-1 flex-shrink-0" />
                  <span>Füge relevante Links oder Dokumente hinzu, die deinen Vorschlag unterstützen.</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaInfoCircle className="text-[#6B46C1] mt-1 flex-shrink-0" />
                  <span>Wähle eine passende Kategorie für deinen Vorschlag.</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaInfoCircle className="text-[#6B46C1] mt-1 flex-shrink-0" />
                  <span>Setze eine realistische Deadline für die Abstimmung.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Prozess</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-[#6B46C1] to-[#805AD5] text-white flex items-center justify-center font-medium shadow-md">1</div>
                  <div>
                    <h3 className="font-medium text-gray-900">Proposal erstellen</h3>
                    <p className="text-sm text-gray-600 mt-1">Fülle das Formular mit allen erforderlichen Informationen aus.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-[#6B46C1] to-[#805AD5] text-white flex items-center justify-center font-medium shadow-md">2</div>
                  <div>
                    <h3 className="font-medium text-gray-900">Überprüfung</h3>
                    <p className="text-sm text-gray-600 mt-1">Dein Proposal wird von der Community überprüft und diskutiert.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-[#6B46C1] to-[#805AD5] text-white flex items-center justify-center font-medium shadow-md">3</div>
                  <div>
                    <h3 className="font-medium text-gray-900">Abstimmung</h3>
                    <p className="text-sm text-gray-600 mt-1">Die Community stimmt über deinen Vorschlag ab.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}