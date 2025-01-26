import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

/**
 * Subscriptions component toont de beschikbare subscriptions en laat de gebruiker een subscription kiezen.
 * @returns
 */
function Subscriptions() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [companyName, setCompanyName] = useState('');
    const [companyId, setCompanyId] = useState('');
    const [currentSub, setCurrentSub] = useState('');
    const [email, setMail] = useState('');
    const navigate = useNavigate();

    /**
     * Haal de gebruikersinformatie op van de huidige ingelogde gebruiker.
     */
    const getUserInfo = async () => {
        const loggedInCheckResponse = await fetch("https://localhost:7289/api/Account/getCurrentAccount", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (loggedInCheckResponse.ok) {
            const stuff = await loggedInCheckResponse.json();
            if (stuff.role && stuff.role.includes("CompanyAdmin")) {
                setCompanyName(stuff.companyName);
                setCompanyId(stuff.companyId);
                setMail(stuff.email);
            } else {
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
    };

    /**
     * Haal de company informatie op van de huidige ingelogde gebruiker.
     * @param {any} companyId
     */
    const getCompanyInfo = async (companyId) => {
        const companyFound = await fetch(`https://localhost:7289/api/Company/getCurrentCompany?companyId=${companyId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (companyFound.ok) {
            const company = await companyFound.json();
            console.log(company);
            setCurrentSub(company.subscriptionId);
        } else {
            console.error("Failed to fetch company info");
        }
    };

    /**
     * Haal de subscription informatie op.
     */
    const getSubscriptionInfo = async () => {
        try {
            const subscriptionInfo = await fetch('https://localhost:7289/api/Subscription/GetSubscriptionDetails', {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (subscriptionInfo.ok) {
                const subscription = await subscriptionInfo.json();
                setSubscriptions(subscription);
            } else {
                console.error("Failed to fetch subscription info");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    /**
     * Handel de klik op een subscription kaart af en update de subscription
     * @param {any} subscriptionId
     */
    const handleSubscriptionClick = async (subscriptionId) => {
        const confirmed = window.confirm("Weet u zeker dat u deze subscription wilt kiezen?");
        if (confirmed) {
            try {
                const response = await fetch('https://localhost:7289/api/Subscription/PostSubscriptionDetails', {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ companyId, subscriptionId }),
                });

                if (response.ok) {
                    const updatedSubscriptions = await response.json();
                    setSubscriptions(updatedSubscriptions);
                    setCurrentSub(subscriptionId);
                    alert("Subscription updated successfully");

                    // Find the selected subscription details
                    const selectedSubscription = subscriptions.find(sub => sub.id === subscriptionId);

                    // stuur via back end een email
                    const emailResponse = await fetch('https://localhost:7289/api/Email/send-email', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            from: "carandall@2a3e198781496c5c.maileroo.org",
                            to: `${email}`,
                            subject: `Subscription Updated: ${selectedSubscription.description}`,
                            templateId: "862",
                            templateData: JSON.stringify({
                                subscriptionId: selectedSubscription.id,
                                description: selectedSubscription.description,
                                price: selectedSubscription.price,
                                duration: selectedSubscription.duration
                            })
                        }),
                    });

                    if (emailResponse.ok) {
                        console.log(await emailResponse.json());
                    } else {
                        console.error("Failed to send email");
                        console.error(await emailResponse.text());
                    }
                } else {
                    console.error("Failed to update subscription");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }
    };

    /**
     * Voer de getUserInfo en getCompanyInfo functies uit bij het laden van de pagina.
     */
    useEffect(() => {
        getUserInfo();
    }, []);

    /**
     * Haal de company informatie op als de companyId is veranderd
     */
    useEffect(() => {
        if (companyId) {
            getCompanyInfo(companyId);
        }
    }, [companyId]);

    /**
     * Haal de subscription informatie op bij het laden van de pagina
     */
    useEffect(() => {
        getSubscriptionInfo();
    }, []);

    return (
        <div className="container" style={{ color: 'black' }}>
            <p>Uw huidige subscription voor {companyName} is {currentSub}</p>
            <div className="users-container" style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
                {subscriptions.map((subscriptionInfo, index) => (
                    <div
                        key={index}
                        className="user-card"
                        style={{ margin: '10px', padding: '10px', border: '1px solid #ccc', cursor: 'pointer' }}
                        onClick={() => handleSubscriptionClick(subscriptionInfo.id)}
                    >
                        <p><strong>Subscription ID:</strong> {subscriptionInfo.id}</p>
                        <p><strong>Description:</strong> {subscriptionInfo.description}</p>
                        <p><strong>Price:</strong> {subscriptionInfo.price}</p>
                        <p><strong>Duration:</strong> {subscriptionInfo.duration}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Subscriptions;
