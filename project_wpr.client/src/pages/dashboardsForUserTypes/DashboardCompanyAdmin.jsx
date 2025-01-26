import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Dashboard component voor company admins
 * 
 * @returns {JSX.Element} Het gerenderde component dat het dashboard toont.
 */
function DashboardCompanyAdmin() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [companyName, setCompanyName] = useState('');
    const [companyId, setCompanyId] = useState('');
    const [currentSub, setCurrentSub] = useState('');
    const [email, setMail] = useState('');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
    });

    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSuccess(false);
        if (formData.email === "") {
            setMessage("Please enter email.");
            return;
        }

        if (formData.password === "") {
            setMessage("Please enter password.");
            return;
        }

        if (formData.firstName === "") {
            setMessage("Please enter first name.");
            return;
        }

        if (formData.lastName === "") {
            setMessage("Please enter last name.");
            return;
        }

        if (formData.dateOfBirth === "") {
            setMessage("Please enter date of birth.");
            return;
        }

        try {
            const response = await fetch("https://localhost:7289/api/Register/register-business-renter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                setIsSuccess(true);
                setMessage("Registration successful!");
            } else {
                setIsSuccess(false);
                if (result.errors) {
                    const errorMessages = Object.values(result.errors)
                        .flat()
                        .join(" ");
                    setMessage(errorMessages);
                } else {
                    setMessage(result.message || "Registration failed.");
                }
            }
        } catch (error) {
            setIsSuccess(false);
            setMessage("An error occurred. Please try again later.");
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
            const subscriptionEndDate = new Date(company.subscriptionEndDate);
            const today = new Date();
            const daysLeft = Math.ceil((subscriptionEndDate - today) / (1000 * 60 * 60 * 24));
            console.log(daysLeft);

            if (daysLeft < 0) {
                console.log("Uw subscriptie is verlopen.");
                return;
            }

            if (daysLeft < 7 && daysLeft > 3) {
                alert(`Uw subscriptie verloopt over ${daysLeft} dagen`);
            }

            if (daysLeft < 3) {
                alert(`Uw subscriptie verloopt over ${daysLeft} dagen wilt u gebruik maken van de huidige voordelen vernieuw het dan snel`);
                const nextMonth = new Date();
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                nextMonth.setDate(1);
                const endOfNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0);

                const response = await fetch('https://localhost:7289/api/Subscription/PostSubscriptionDetails', {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ companyId, subscriptionId: company.subscriptionId, startDate: nextMonth.toISOString(), endDate: endOfNextMonth.toISOString() }),
                });

                if (response.ok) {
                    const updatedSubscriptions = await response.json();
                    console.log("Subscriptie gewijzigd:", updatedSubscriptions);
                    setCurrentSub(company.subscriptionId);
                    alert("Subscriptie gewijzigd");

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
                } else {
                    console.error("Failed to update subscription:", await response.text());
                }
            }
        } else {
            console.error("Failed to fetch company info");
        }
    };

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

    useEffect(() => {
        getUserInfo();
    }, []);

    useEffect(() => {
        if (companyId) {
            getCompanyInfo(companyId);
        }
    }, [companyId]);

    return (
        <div>
            <h2>Create new Business Renter account</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Date of Birth:</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit">Register</button>

                <p style={{ color: isSuccess ? "green" : "red" }}>{message}</p>
            </form>
        </div>
    );
}

export default DashboardCompanyAdmin;

