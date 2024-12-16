export async function showAccountDropdown() {
    const loggedInCheckResponse = await fetch("https://localhost:7289/api/Account/getCurrentAccount", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (loggedInCheckResponse.ok) {
        const stuff = await loggedInCheckResponse.json();
        document.getElementById("dropdownUserTag").innerHTML = stuff.fName;
        document.getElementById("AccountDropdownBTNTopBar").classList.remove("hide");
        document.getElementById("LoginBTNTopBar").classList.add("hide");
    } else {
        document.getElementById("LoginBTNTopBar").classList.remove("hide");
        document.getElementById("AccountDropdownBTNTopBar").classList.add("hide");
    }
}

export async function showLoginBTN() {
    document.getElementById("LoginBTNTopBar").classList.remove("hide");
    document.getElementById("AccountDropdownBTNTopBar").classList.add("hide");
}