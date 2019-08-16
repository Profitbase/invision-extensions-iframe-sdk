type ChannelInfo = {
    messageAddress?: string,
    targetOrigin?: string,
    origin?: string,
    sourceWindow?: Window | MessagePort | ServiceWorker | null,
    allowedTargetOrigins?: string[]
};

export type SendMessageConfig = {
    message: any,
    allowedTargetOrigins?: string[]
}

const invision = (function () {
    let communicationInfo: ChannelInfo = {};

    const allowTargetOrigin = (targetOrigin: string | undefined, allowedTargetOrigins: string[]): boolean => {
        if (targetOrigin && allowedTargetOrigins.length) {
            return allowedTargetOrigins.some(c => c.toLowerCase() === targetOrigin.toLowerCase());
        }
        return true;
    }

    const setup = (evt: MessageEvent) => {
        if (evt.data.source === 'pb_invision' && evt.data.type === 'com_config') {

            if (!evt.data.targetOrigin) {
                console.error('Required field targetOrigin not specified on message');
            }

            communicationInfo = {
                messageAddress: evt.data.messageAddress,
                targetOrigin: evt.data.targetOrigin,
                origin: evt.data.origin,
                sourceWindow: evt.source,
                ...communicationInfo
            };

            window.removeEventListener('message', setup);
        }
    }

    window.addEventListener('message', setup);

    const sendMessage = (message: SendMessageConfig | any) => {
        if (!message) {
            return;
        }

        //const communicationInfo = invision.CommunicationInfo;
        if (!communicationInfo || !communicationInfo.targetOrigin) {
            console.error('Not hosted inside an InVision iFrame, communication is not initialized or now allowed (based on target origin restrictions).');
            return;
        }

        if (!communicationInfo.targetOrigin) {
            console.error('targetOrigin not defined');
            return;
        }

        const allowedTargetOrigins = [...communicationInfo.allowedTargetOrigins || [], ...message.allowedTargetOrigins || []];
        if (!allowTargetOrigin(communicationInfo.targetOrigin, allowedTargetOrigins)) {
            return;
        }

        window.parent.postMessage({
            messageAddress: communicationInfo.messageAddress,
            message: message
        }, communicationInfo.targetOrigin);
    }

    /**
     * Sets the target origins which are allowed to send messages to using the sendMesage() function.
     * You can also specify the allowed target origins in the message object passed to the sendMessage() function.
     * If you send any type of sensitive information from your iframe extension to InVision using this API, you should specify the allowed target origins
     * to ensure that no message is sent to unwanted listeners.
     * @param allowedTargetOrigins
     */
    const setAllowedTargetOrigins = (allowedTargetOrigins: string[]) => {
        communicationInfo = { ...communicationInfo, allowedTargetOrigins: allowedTargetOrigins };
    }

    return { sendMessage, setAllowedTargetOrigins };

})();

export default invision;

