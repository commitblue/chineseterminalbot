require("dotenv").config()
const fetch = require("node-fetch")
const cookie = process.env.roblosecurity

async function getCsrf() {
    const response = await fetch("https://friends.roblox.com/v1/users/2321/request-friendship", {
        method: "POST",
        headers: {
            Cookie: `.ROBLOSECURITY=${cookie}`
        }
    })
 
    if (response.status === 403) {
        return response.headers.get("x-csrf-token")
    }
}

const changeDesc = async(desc) => {
    const csrf = await getCsrf()
    if (csrf){
        try {
            const response = await fetch(
                "https://accountinformation.roblox.com/post_v1_description",
                {
                    method: "POST",
                    headers: {
                        Cookie: `.ROBLOSECURITY=${cookie}`,
                        "x-csrf-token": csrf,
                        "Content-Type": "application/json"
                    },
                    body: {
                        description: desc
                    }
                }
            )
            if (!response.ok){
                console.log("Err : " + response.status + " " + response.statusText)
            }
        } catch(err) {
            console.log("Error occured : " + err.message)
        }
    }
}

const changeDescLoop = async () => {
    await changeDesc("INVALID REQUEST TRY AGAIN")
    setTimeout(async () => {
        await changeDesc("REQUEST SUCCESS, MESSAGE : {\n   content:`failed to get message`\n}")
        setTimeout(changeDescLoop, 1000)
    }, 3000)
}

changeDescLoop()