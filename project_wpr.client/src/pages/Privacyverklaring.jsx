import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./About.css";

/**
 * Component for the privacy policy page.
 * @returns
 */
function Privacyverklaring() {
    const navigate = useNavigate();

    const placeholder = `<div id="PrivacyPolicyWrapper" className='div'>
        <h2>Your Privacy Policy Title</h2>
        <p className='tekst'>This is a placeholder for your privacy policy content. Edit as needed.</p>
    </div>`;

    const [content, setContent] = useState(placeholder);
    const [history, setHistory] = useState([]);
    const [userType, setUserType] = useState("");
    const [editMode, setEditMode] = useState(false);

    /**
     * Fetches the user info from the API to determine the user's role.
     */
    const getUserInfo = async () => {
        const loggedInCheckResponse = await fetch(
            "https://localhost:7289/api/Account/getCurrentAccount",
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (loggedInCheckResponse.ok) {
            const user = await loggedInCheckResponse.json();
            setUserType(user.role);

            if (user.role === "CompanyAdmin" && !user.companyId) {
                navigate("/createcompany");
            }
        } else {
            navigate("/login");
        }
    };

    /**
     * Fetches the privacy policy content from the API.
     */
    const fetchPrivacyPolicy = async () => {
        const response = await fetch("https://localhost:7289/api/PrivacyPolicyEditing/get", {
            method: "GET",
        });

        if (response.ok) {
            const data = await response.json();
            const updatedContent = data.text.replace(/className/g, 'class');
            setContent(updatedContent);
        } else {
            console.error("Failed to fetch privacy policy content");
        }
    };

    /**
     * Toggles the edit mode for the privacy policy content.
     */
    const toggleEditMode = () => {
        setEditMode((prevMode) => !prevMode);
    };

    /**
     * Handles the change event for the privacy policy content.
     * @param {any} event
     */
    const handleContentChange = (event) => {
        const newContent = event.target.value;
        setHistory((prevHistory) => [...prevHistory, content]);
        setContent(newContent);
    };

    /**
     * Handles saving the updated privacy policy content.
     */
    const handleSave = async () => {
        setEditMode(false);
        try {
            const response = await fetch("https://localhost:7289/api/PrivacyPolicyEditing/UpdatePrivacyPolicy", {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(content.replace(/class/g, 'className')),
            });

            if (response.ok) {
                console.log("Privacy Policy updated successfully!");
            } else {
                console.error("Failed to update privacy policy");
            }
        } catch (error) {
            console.error("Error saving privacy policy:", error);
        }
    };

    /**
     * Cancels the edit mode and reverts the content to the previous state.
     */
    const handleCancel = () => {
        setEditMode(false);
        setContent(history[history.length - 1] || placeholder);
    };

    /**
     * Initializes the component by fetching the user info and privacy policy content.
     */
    useEffect(() => {
        getUserInfo();
        fetchPrivacyPolicy();
    }, []);

    return (
        <div className="Test">
            {userType === "EmployeeBackOffice" && (
                <div>
                    <button onClick={toggleEditMode}>
                        {editMode ? "Disable Edit Mode" : "Enable Edit Mode"}
                    </button>
                </div>
            )}

            {editMode && (
                <h3 style={{ color: "orange" }}>
                    Edit mode is enabled. You can edit the privacy policy below.
                </h3>
            )}

            <div id="PrivacyPolicyWrapper" className="div">
                {editMode ? (
                    <div>
                        <textarea
                            value={content}
                            onChange={handleContentChange}
                            style={{
                                width: "70vw",
                                height: "80vh",
                                fontFamily: "monospace",
                                fontSize: "14px",
                                lineHeight: "1.5",
                                marginBottom: "10px",
                            }}
                        />

                        <div>
                            <button
                                onClick={handleSave}
                                style={{
                                    padding: "10px 15px",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                    backgroundColor: "green",
                                    color: "white",
                                    marginRight: "10px",
                                }}
                            >
                                Save
                            </button>
                            <button
                                onClick={handleCancel}
                                style={{
                                    padding: "10px 15px",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                    backgroundColor: "red",
                                    color: "white",
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                )}
            </div>
        </div>
    );
}

export default Privacyverklaring;
