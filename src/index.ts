
const allowTargetOrigin = (targetOrigin : string, allowedTargetOrigins : string[]) : boolean => {
    if(allowedTargetOrigins.length){
        return allowedTargetOrigins.some(c => c.toLowerCase() === targetOrigin.toLowerCase());        
    }
    return true;
}

const setup = (evt : MessageEvent) => {
    if (evt.data.source === 'pb_invision' && evt.data.type === 'com_config') {        
        invision.CommunicationInfo = {            
            messageAddress: evt.data.messageAddress,
            targetOrigin: evt.data.targetOrigin,
            origin: evt.data.origin,
            sourceWindow: evt.source,
            ...invision.CommunicationInfo,                       
        };
        
        window.removeEventListener('message', setup);        
    }
}

window.addEventListener('message', setup);

type ChannelInfo = {
    messageAddress: string,
    targetOrigin: string,
    origin: string,
    sourceWindow: Window | MessagePort | ServiceWorker | null,
    allowedTargetOrigins?: string[]
};

export type SendMessageConfig = {
    message : any,
    allowedTargetOrigins? : string[]
}

export default class invision {

    public static CommunicationInfo : ChannelInfo;

    public static sendMessage(message: SendMessageConfig | any) {
        if(!message){
            return;
        }

        const communicationInfo = invision.CommunicationInfo;
        if (!communicationInfo || !communicationInfo.targetOrigin) {
            console.error('Not hosted inside an InVision iFrame, communication is not initialized or now allowed (based on target origin restrictions).');
            return;
        }

        const allowedTargetOrigins = [...communicationInfo.allowedTargetOrigins || [], ...message.allowedTargetOrigins || []];
        if(!allowTargetOrigin(communicationInfo.targetOrigin, allowedTargetOrigins)){
            return;
        }

        window.parent.postMessage({
            messageAddress: communicationInfo.messageAddress,
            message: message.message || message
        }, communicationInfo.targetOrigin);
    }

    /**
     * Sets the target origins which are allowed to send messages to using the sendMesage() function.
     * You can also specify the allowed target origins in the message object passed to the sendMessage() function.
     * If you send any type of sensitive information from your iframe extension to InVision using this API, you should specify the allowed target origins
     * to ensure that no message is sent to unwanted listeners.
     * @param allowedTargetOrigins 
     */
    public static setAllowedTargetOrigins(allowedTargetOrigins : string[]){
        invision.CommunicationInfo = {...invision.CommunicationInfo, allowedTargetOrigins: allowedTargetOrigins};        
    }
}

