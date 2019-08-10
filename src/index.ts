
export default class invision {
    public static sendMessage(message: any) {
        const targetInfo = (window as any).invision_ext_iframe_api;

        if(!targetInfo){
            console.error('Not hosted inside an InVision iFrame or communication is not initialized.');
            return;
        }

        window.parent.postMessage({
            messageAddress: targetInfo.messageAddress,
            message: message
        }, targetInfo.targetOrigin);
    }
}

window.addEventListener('message', function (evt: MessageEvent) {
    if (evt.data.source === 'pb_invision' && evt.data.type === 'com_config') {
        (window as any).invision_ext_iframe_api = {
            messageAddress: evt.data.messageAddress,
            targetOrigin: evt.data.targetOrigin
        };
    }
});