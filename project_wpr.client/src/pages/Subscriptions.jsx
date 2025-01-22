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
        const confirmed = window.confirm("Weet u zeker dat u deze subscription wilt kiezen?");
        if (confirmed) {
            try {
                const nextMonth = new Date();
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                nextMonth.setDate(1);
                const endOfNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0);

                console.log("Sending subscription update request:", {
                    companyId,
                    subscriptionId,
                    startDate: nextMonth.toISOString(),
                    endDate: endOfNextMonth.toISOString()
                });

                const response = await fetch('https://localhost:7289/api/Subscription/PostSubscriptionDetails', {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ companyId, subscriptionId, startDate: nextMonth.toISOString(), endDate: endOfNextMonth.toISOString() }),
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
                                startDate: nextMonth.toISOString().split('T')[0], // Include the start date in the email
                                endDate: endOfNextMonth.toISOString().split('T')[0] // Include the end date in the email
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
