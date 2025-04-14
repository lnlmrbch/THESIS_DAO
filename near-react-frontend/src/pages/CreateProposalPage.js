// src/pages/CreateProposalPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    FaHeading,
    FaAlignLeft,
    FaLink,
    FaMoneyBillWave,
    FaUserCircle,
    FaFolderOpen,
    FaCalendarAlt,
    FaUserShield,
} from "react-icons/fa";

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
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date) => {
        setForm((prev) => ({ ...prev, deadline: date }));
    };

    const createProposal = async () => {
        if (!form.title || !form.description) {
            alert("Titel und Beschreibung sind erforderlich.");
            return;
        }

        try {
            const wallet = await selector.wallet();
            await wallet.signAndSendTransaction({
                signerId: accountId,
                receiverId: contractId,
                actions: [
                    {
                        type: "FunctionCall",
                        params: {
                            methodName: "create_proposal",
                            args: {
                                title: form.title,
                                description: form.description,
                                link: form.link || null,
                                tags: form.tags || [],
                                amount: form.amount ? BigInt(parseFloat(form.amount) * 1e24).toString() : null,
                                target_account: form.target_account || null,
                                category: form.category || null,
                                deadline: form.deadline ? Math.floor(form.deadline.getTime() / 1000) : null,
                                required_role: form.required_role || null,
                            },
                            gas: "30000000000000",
                            deposit: "10000000000000000000000", // 0.01 NEAR
                        },
                    },
                ],
            });
            navigate("/proposals");
        } catch (err) {
            console.error("Fehler beim Erstellen des Proposals:", err);
            setStatus("❌ Fehler beim Erstellen des Proposals.");
        }
    };

    const fields = [
        {
            name: "title",
            label: "Titel",
            icon: <FaHeading />,
            description: "Kurzer, prägnanter Titel deines Proposals.",
            type: "text",
        },
        {
            name: "description",
            label: "Beschreibung",
            icon: <FaAlignLeft />,
            description: "Detaillierte Beschreibung deines Vorschlags.",
            type: "textarea",
        },
        {
            name: "link",
            label: "Externer Link",
            icon: <FaLink />,
            description: "Optionaler Verweis auf weiterführende Inhalte (z. B. Dokumente).",
            type: "text",
        },
        {
            name: "amount",
            label: "Betrag (in LIONEL)",
            icon: <FaMoneyBillWave />,
            description: "Gewünschter Betrag für dieses Proposal (z. B. zur Finanzierung).",
            type: "number",
        },
        {
            name: "target_account",
            label: "Zielaccount",
            icon: <FaUserCircle />,
            description: "Account, an den das Geld ggf. gesendet werden soll.",
            type: "text",
        },
        {
            name: "category",
            label: "Kategorie",
            icon: <FaFolderOpen />,
            description: "Wähle einen Bereich, zu dem dein Proposal gehört.",
            type: "select",
            options: [
                { value: "", label: "-- Bitte wählen --" },
                { value: "development", label: "Entwicklung" },
                { value: "community", label: "Community" },
                { value: "events", label: "Events" },
                { value: "marketing", label: "Marketing" },
                { value: "governance", label: "Governance" },
            ],
        },
        {
            name: "deadline",
            label: "Deadline",
            icon: <FaCalendarAlt />,
            description: "Datum, bis wann über das Proposal abgestimmt werden kann.",
            type: "date",
        },
        {
            name: "required_role",
            label: "Benötigte Rolle",
            icon: <FaUserShield />,
            description: "Welche Rolle wird benötigt, um darüber abstimmen zu dürfen?",
            type: "select",
            options: [
                { value: "", label: "-- Keine Einschränkung --" },
                { value: "core", label: "Core" },
                { value: "community", label: "Community" },
                { value: "finance", label: "Finance" },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-[#F5F7FB] text-black px-6 py-12 m-full">
            <h1 className="text-3xl font-bold text-[#2c1c5b]">📝 Neuen Proposal erstellen</h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                {fields.map(({ name, label, icon, description, type, options }) => (
                    <div key={name}>
                        <label className="block text-sm font-semibold text-gray-800 mb-1 flex items-center gap-2">
                            <span className="text-lg">{icon}</span>
                            {label}
                        </label>
                        {type === "textarea" ? (
                            <textarea
                                name={name}
                                value={form[name]}
                                onChange={handleChange}
                                rows={4}
                                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md"
                            />
                        ) : type === "select" ? (
                            <select
                                name={name}
                                value={form[name]}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md"
                            >
                                {options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        ) : type === "date" ? (
                            <DatePicker
                                selected={form.deadline}
                                onChange={handleDateChange}
                                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md"
                                placeholderText="Datum auswählen"
                                dateFormat="dd.MM.yyyy"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                            />
                        ) : (
                            <input
                                type={type}
                                name={name}
                                value={form[name]}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md"
                            />
                        )}
                        <p className="text-xs text-gray-500 mt-1">{description}</p>
                    </div>
                ))}

                <button
                    onClick={createProposal}
                    className="w-full py-3 bg-primary text-white font-semibold rounded-md hover:brightness-110 transition"
                >
                    Proposal einreichen
                </button>
                {status && <p className="text-sm text-red-500">{status}</p>}
            </div>
        </div>
    );
}