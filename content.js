const panel = document.createElement('div');
panel.id = 'customPanel';
panel.innerHTML = `
    <iframe src-chrome-extension="${chrome.runtime.id}/panel.html" frameborder="0" width="300" height="200"></iframe>
    <div id="avatarCount">Avatars that can be transformed: 0</div>
    <button id="convertAvatars">Convert avatars</button>
    <button id="stopConversion">Stop</button>
`;
document.body.appendChild(panel);

let continueConversion = true;

function updateAvatarCount() {
    let avatarsToConvert = document.querySelectorAll('.collection-card-action_dust.st-icon.icon-dust');
    document.getElementById("avatarCount").textContent = `Avatars that can be transformed: ${avatarsToConvert.length}`;
}

async function convertAvatar(avatar) {
    avatar.click();
    await new Promise(r => setTimeout(r, 500));

    let inputField = document.querySelector('input[name="noOfItems"]');
    if (inputField) {
        let maxCount = inputField.getAttribute('max');
        inputField.value = maxCount || "1";
    }

    await new Promise(r => setTimeout(r, 500));

    let dustButton = document.querySelector('button.dusting-modal-action-dust[data-dust-avatar-emoji-form-submit]');
    if (dustButton) {
        dustButton.click();
    } else {
        console.error("Dust button not found");
    }

    await new Promise(r => setTimeout(r, 500));

    let closeButton = document.querySelector('button.dusting-modal-action-dust[data-izimodal-close="dust-modal"]');
    if (closeButton) {
        closeButton.click();
    } else {
        // Falls der Schließen-Button nicht gefunden wird, versuchen Sie, das iziModal direkt zu schließen.
        let modalElement = document.querySelector('.iziModal');
        if (modalElement && typeof modalElement.iziModal === 'function') {
            modalElement.iziModal('close');
        } else {
            console.error("Modal konnte nicht geschlossen werden.");
        }
    }

    await new Promise(r => setTimeout(r, 500));
}

document.getElementById("convertAvatars").addEventListener("click", async function() {
    continueConversion = true;
    let avatarsToConvert = document.querySelectorAll('.collection-card-action_dust.st-icon.icon-dust');

    for (let avatar of avatarsToConvert) {
        if (!continueConversion) break;
        await convertAvatar(avatar);
    }

    updateAvatarCount();
});

document.getElementById("stopConversion").addEventListener("click", function() {
    continueConversion = false;
});

updateAvatarCount();
