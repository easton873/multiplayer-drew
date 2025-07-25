export class JoinScreen {
    // join room screen
    public div = document.getElementById("formScreen") as HTMLDivElement;
    public roomInput = document.getElementById("roomInput") as HTMLInputElement;
    public nameInput = document.getElementById("nameInput") as HTMLInputElement;
    public colorSelect = document.getElementById("colorInput") as HTMLInputElement;
    public joinButton = document.getElementById("joinButton") as HTMLButtonElement;
    public createButton = document.getElementById("createButton") as HTMLButtonElement;
    
    // Modal elements
    public roomCodeModal = document.getElementById("roomCodeModal") as HTMLDivElement;
    public confirmJoinButton = document.getElementById("confirmJoinButton") as HTMLButtonElement;
    public cancelJoinButton = document.getElementById("cancelJoinButton") as HTMLButtonElement;
    public colorPreview = document.getElementById("colorPreview") as HTMLDivElement;

    constructor() {
        this.setupColorPreview();
    }

    private setupColorPreview() {
        // Update color preview when color input changes
        this.colorSelect.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            this.colorPreview.style.backgroundColor = target.value;
        });
    }

    public showRoomCodeModal() {
        this.roomCodeModal.classList.add('show');
        this.roomInput.focus();
    }

    public hideRoomCodeModal() {
        this.roomCodeModal.classList.remove('show');
        this.roomInput.value = '';
    }
}