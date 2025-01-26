import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Subscriptions() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [companyName, setCompanyName] = useState('');
    const [companyId, setCompanyId] = useState('');
    const [currentSub, setCurrentSub] = useState('');
    const [email, setMail] = useState('');
    const navigate = useNavigate();

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
            const subscriptionEndDate = new Date(company.subscriptionEndDate);
            const today = new Date();
            const daysLeft = Math.ceil((subscriptionEndDate - today) / (1000 * 60 * 60 * 24));
            console.log(daysLeft);

            if (daysLeft < 0) {
                console.log("Subscription has already ended.");
                return;
            }

            if (daysLeft < 7 && daysLeft > 3) {
                alert(daysLeft);
            }

            if (daysLeft < 3) {
                alert(daysLeft);
                const nextMonth = new Date();
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                nextMonth.setDate(1);
                const endOfNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0);

                    // Find the selected subscription details
                    const selectedSubscription = subscriptions.find(sub => sub.id === company.subscriptionId);

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
                                duration: selectedSubscription.duration,
                                startDate: nextMonth.toISOString().split('T')[0],   
                                endDate: endOfNextMonth.toISOString().split('T')[0],
                                leftDays: daysLeft
                            })
                        }),
                    });

                    if (emailResponse.ok) {
                        console.log("Email sent successfully:", await emailResponse.json());
                    } else {
                        console.error("Failed to send email:", await emailResponse.text());
                    }
                
            }
        } else {
            console.error("Failed to fetch company info");
        }
    };

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

    const handleSubscriptionClick = async (subscriptionId) => {
        const confirmed = window.confirm("Weet u zeker dat u deze abonnement wilt kiezen?");
        if (confirmed) {
            try {
                const startDate = new Date();
                const endDate = new Date(startDate);
                endDate.setMonth(endDate.getMonth() + 1);

                console.log("Sending subscription update request:", {
                    companyId,
                    subscriptionId,
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString()
                });


                const response = await fetch('https://localhost:7289/api/Subscription/PostSubscriptionDetails', {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ companyId, subscriptionId, startDate: startDate.toISOString(), endDate: endDate.toISOString() }),
                });

                if (response.ok) {
                    const updatedSubscriptions = await response.json();
                    console.log("Subscription update response:", updatedSubscriptions);
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
                                duration: selectedSubscription.duration,
                                startDate: startDate.toISOString().split('T')[0],
                                endDate: endDate.toISOString().split('T')[0]
                            })
                        }),
                    });

                    if (emailResponse.ok) {
                        console.log("Email sent successfully:", await emailResponse.json());
                    } else {
                        console.error("Failed to send email:", await emailResponse.text());
                    }
                } else {
                    console.error("Failed to update subscription:", await response.text());
                }
            } catch (error) {
                console.error("Error in handleSubscriptionClick:", error);
            }
        }
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    useEffect(() => {
        if (companyId) {
            getCompanyInfo(companyId);
        }
    }, [companyId]);

    useEffect(() => {
        getSubscriptionInfo();
    }, []);

    return (
        <div className="container" style={{ color: 'black' }}>
            <p>Uw huidige subscription voor {companyName} is {currentSub}</p>
            <div onClick={() => handleSubscriptionClick(6)}>
            <stripe-buy-button 
                buy-button-id="buy_btn_1QkoD1Gvad1OE93cX8Bziw3e"
                publishable-key="pk_test_51QknyhGvad1OE93cOq5OCCpu1H0FK4CPFAnNlv0Y2enTgkpVk5RfYF5L16hfqtTP4P6mxQhOXIBCGEKxTPGsMwkk00WrUiaJH2"
                >
                </stripe-buy-button>
            </div>
            <div onClick={() => handleSubscriptionClick(6)}>
            <stripe-buy-button
                buy-button-id="buy_btn_1Qkr8VGvad1OE93cDI9nLcrd"
                publishable-key="pk_test_51QknyhGvad1OE93cOq5OCCpu1H0FK4CPFAnNlv0Y2enTgkpVk5RfYF5L16hfqtTP4P6mxQhOXIBCGEKxTPGsMwkk00WrUiaJH2"
            >
                </stripe-buy-button>
            </div>
        </div>
    );
}

export default Subscriptions;
