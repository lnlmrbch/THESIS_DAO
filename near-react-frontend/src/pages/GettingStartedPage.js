import React, { useEffect, useState } from "react";
import { FaWallet, FaUserCircle, FaCoins, FaVoteYea, FaArrowRight, FaCheckCircle, FaLock, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const steps = [
  {
    id: "wallet",
    title: "Wallet verbinden",
    description: "Verbinde deine NEAR Wallet mit der DAO App.",
    icon: <FaWallet className="text-3xl text-[#6B46C1]" />,
    check: (accountId) => !!accountId,
    benefits: ["Sichere Transaktionen", "Dezentrale Verwaltung", "Blockchain-Integration"]
  },
  {
    id: "profile",
    title: "Profil ausfüllen",
    description: "Gib deinen Namen, E-Mail und Sprache an.",
    icon: <FaUserCircle className="text-3xl text-[#6B46C1]" />,
    check: (hasProfile) => hasProfile === true,
    benefits: ["Personalisierte Erfahrung", "Community-Integration", "Benachrichtigungen"]
  },
  {
    id: "tokens",
    title: "Tokens kaufen",
    description: "Erwerbe DAO Tokens für Abstimmungen.",
    icon: <FaCoins className="text-3xl text-[#6B46C1]" />,
    check: (balance) => parseFloat(balance) > 0,
    benefits: ["Stimmrechte", "Gewinnbeteiligung", "DAO-Mitgliedschaft"]
  },
  {
    id: "proposal",
    title: "Proposal erstellen oder abstimmen",
    description: "Beteilige dich aktiv an der DAO.",
    icon: <FaVoteYea className="text-3xl text-[#6B46C1]" />,
    check: () => true,
    benefits: ["Demokratische Teilhabe", "Community-Entscheidungen", "Aktive Mitgestaltung"]
  },
];

export default function GettingStartedPage({ accountId, userBalance }) {
  const [hasProfile, setHasProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfile = async () => {
      if (!accountId) return;
      try {
        const res = await fetch(`/api/members/by-id/${accountId}`);
        setHasProfile(res.ok);
      } catch (err) {
        console.error("Fehler beim Profilcheck:", err);
        setHasProfile(false);
      }
    };
    checkProfile();
  }, [accountId]);

  const isStepDone = (step) => {
    switch (step.id) {
      case "wallet":
        return !!accountId;
      case "profile":
        return hasProfile === true;
      case "tokens":
        return parseFloat(userBalance) > 0;
      default:
        return false;
    }
  };

  const doneSteps = steps.filter((step) => isStepDone(step)).length;
  const progress = Math.round((doneSteps / steps.length) * 100);

  return (
    <div className="min-h-screen bg-pattern text-black px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-8 text-center"
        >
          <h1 className="text-4xl font-bold text-[#2c1c5b] mb-4">
            Willkommen in der DAO!
      </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Folge diesen Schritten, um vollständig in die DAO-Community integriert zu werden.
          </p>
        </motion.div>

        {/* Progress Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#2c1c5b]">
              Dein Fortschritt
            </h2>
            <span className="text-[#6B46C1] font-bold">
              {doneSteps} von {steps.length} Schritten
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-gradient-to-r from-[#6B46C1] to-[#805AD5] h-full"
        />
      </div>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, index) => {
          const done = isStepDone(step);
          return (
              <motion.div
              key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`glass-effect rounded-xl p-6 ${
                  done ? "border-2 border-green-500" : ""
              }`}
            >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    done ? "bg-green-100" : "bg-[#6B46C1]/10"
                  }`}>
                {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#2c1c5b]">
                    {step.title}
                  </h3>
                      {done && (
                        <FaCheckCircle className="text-green-500 text-xl" />
                      )}
                    </div>
                    <p className="text-gray-600 mt-1">{step.description}</p>
                    
                    {/* Benefits List */}
                    <div className="mt-4 space-y-2">
                      {step.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <FaShieldAlt className="text-[#6B46C1] text-xs" />
                          {benefit}
                </div>
                      ))}
              </div>

                    {!done && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      switch (step.id) {
                        case "wallet":
                          break;
                        case "profile":
                          navigate("/profile");
                          break;
                        case "tokens":
                          navigate("/buy-tokens");
                          break;
                        case "proposal":
                          navigate("/proposals");
                          break;
                        default:
                          break;
                      }
                    }}
                        className="modern-button mt-4 w-full"
                  >
                        <FaArrowRight className="mr-2" /> Jetzt starten
                      </motion.button>
                )}
              </div>
            </div>
              </motion.div>
          );
        })}
        </div>

        {/* Security Note */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-effect rounded-xl p-6 bg-[#6B46C1]/5"
        >
          <div className="flex items-center gap-3">
            <FaLock className="text-[#6B46C1] text-xl" />
            <h3 className="text-lg font-semibold text-[#2c1c5b]">
              Sicherheit & Privatsphäre
            </h3>
          </div>
          <p className="text-gray-600 mt-2">
            Deine Daten sind sicher. Wir nutzen die NEAR Blockchain für maximale Transparenz und Sicherheit.
            Alle Transaktionen sind verschlüsselt und deine Privatsphäre wird geschützt.
          </p>
        </motion.div>
      </div>
    </div>
  );
}