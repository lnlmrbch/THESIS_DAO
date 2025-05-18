import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaCoins, 
  FaWallet, 
  FaCheckCircle, 
  FaShieldAlt, 
  FaUsers, 
  FaVoteYea,
  FaInfoCircle,
  FaExclamationTriangle,
  FaExchangeAlt,
  FaChartLine,
  FaLock,
  FaHandshake,
  FaWineGlassAlt
} from "react-icons/fa";

const TOKEN_PRICE_CHF = 1; // 1 Token = 1 CHF
const NEAR_TO_CHF_RATE = 5; // Beispiel: 1 NEAR = 5 CHF

const BuyTokensPage = ({ wallet, accountId }) => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const quickAmounts = [50, 100, 200, 500];

  // Konvertiere CHF zu NEAR
  const convertChfToNear = (chfAmount) => {
    return (parseFloat(chfAmount) / NEAR_TO_CHF_RATE).toFixed(4);
  };

  // Berechne die Anzahl der Tokens basierend auf CHF
  const calculateTokens = (chfAmount) => {
    return parseFloat(chfAmount) / TOKEN_PRICE_CHF;
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const txHash = params.get("transactionHashes");

    if (txHash) {
      const storedAmount = localStorage.getItem("lastBuyAmount") || "unbekannt";
      localStorage.removeItem("lastBuyAmount");

      // Aktivität in die DB schreiben
      fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId,
          type: "buy",
          description: `Tokenkauf über ${storedAmount} CHF`,
          timestamp: new Date().toISOString(),
        }),
      });

      navigate("/success", {
        state: {
          amount: storedAmount,
          timestamp: new Date().toLocaleString(),
        },
      });
    }
  }, [location.search, accountId, navigate]);

  const handleBuy = async () => {
    if (!wallet || !accountId) return;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Bitte gib einen gültigen CHF-Betrag ein.");
      return;
    }

    const nearAmount = convertChfToNear(parsedAmount);
    const yoctoAmount = BigInt(parseFloat(nearAmount) * 1e24).toString();
    localStorage.setItem("lastBuyAmount", parsedAmount);

    setIsLoading(true);
    try {
      await wallet.signAndSendTransaction({
        signerId: accountId,
        receiverId: "dao.lioneluser.testnet",
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "buy_tokens",
              args: {},
              gas: "300000000000000",
              deposit: yoctoAmount,
            },
          },
        ],
      });
    } catch (err) {
      console.error("❌ Kauf fehlgeschlagen:", err);
      alert("Fehler beim Token-Kauf.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!wallet || !accountId) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-xl shadow-md border border-gray-200 max-w-md w-full mx-4"
        >
          <div className="flex items-center gap-3 text-red-500 mb-4">
            <FaExclamationTriangle className="text-xl" />
            <h2 className="text-xl font-semibold">Anmeldung erforderlich</h2>
          </div>
          <p className="text-gray-600">
            Bitte melde dich an, um Token zu kaufen und Teil der DAO zu werden.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pattern text-black py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-6 sm:p-8 shadow-sm mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#2c1c5b] flex items-center gap-3">
                <FaCoins className="text-[#6B46C1]" />
                Thesis DAO Token kaufen
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <FaWallet className="text-gray-500" />
                Eingeloggt als: <span className="font-semibold text-[#2c1c5b]">{accountId}</span>
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content - Token Purchase */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-effect rounded-xl p-6 sm:p-8 shadow-sm h-full"
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Betrag in CHF
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="z. B. 100"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg text-black focus:ring-2 focus:ring-[#6B46C1] focus:border-transparent transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">CHF</span>
                  </div>
                  {amount && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2"
                    >
                      <div className="text-sm text-[#6B46C1] font-medium flex items-center gap-2">
                        <FaCoins />
                        Du erhältst {calculateTokens(amount)} Thesis DAO Tokens
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {quickAmounts.map((quickAmount) => (
                    <button
                      key={quickAmount}
                      onClick={() => {
                        setAmount(quickAmount.toString());
                        setSelectedAmount(quickAmount);
                      }}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedAmount === quickAmount
                          ? 'bg-[#6B46C1] text-white border-[#6B46C1]'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-[#6B46C1] hover:text-[#6B46C1]'
                      }`}
                    >
                      {quickAmount} CHF
                    </button>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuy}
                  disabled={isLoading}
                  className={`w-full modern-button ${
                    isLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Verarbeite...
                    </div>
                  ) : (
                    <>
                      <FaCheckCircle /> Jetzt kaufen
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Information */}
          <div className="lg:col-span-5 space-y-6">
            {/* Benefits Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-effect rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-[#2c1c5b] mb-4 flex items-center gap-2">
                <FaUsers className="text-[#6B46C1]" /> Vorteile
              </h2>
              <ul className="space-y-4">
                <motion.li 
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-3 group"
                >
                  <FaVoteYea className="text-[#6B46C1] mt-1 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-600">Erhalte Stimmrechte in der DAO</span>
                </motion.li>
                <motion.li 
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-3 group"
                >
                  <FaUsers className="text-[#6B46C1] mt-1 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-600">Werde Teil einer aktiven Community</span>
                </motion.li>
                <motion.li 
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-3 group"
                >
                  <FaVoteYea className="text-[#6B46C1] mt-1 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-600">Unterstütze neue Vorschläge</span>
                </motion.li>
              </ul>
            </motion.div>

            {/* Security Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-[#2c1c5b] mb-4 flex items-center gap-2">
                <FaShieldAlt className="text-[#6B46C1]" /> Sicherheit & Transparenz
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FaLock className="text-[#6B46C1] mt-1" />
                  <p className="text-gray-600">
                    Transaktionen werden über die NEAR Wallet signiert.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <FaChartLine className="text-[#6B46C1] mt-1" />
                  <p className="text-gray-600">
                    Token-Preis: 1 Thesis DAO Token = {TOKEN_PRICE_CHF} CHF
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <FaHandshake className="text-[#6B46C1] mt-1" />
                  <p className="text-gray-600">
                    Sofortige Token-Ausgabe nach erfolgreicher Transaktion
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyTokensPage;