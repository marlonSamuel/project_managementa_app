import { LoadingOutlined } from "@ant-design/icons";
import { notification } from "antd";

export const initialState = {
    current_page: 0,
    first_page_url: '',
    data: [] as any,
    from: 0,
    last_page: 0,
    last_page_url: '',
    next_page_url: '',
    path: '',
    per_page: 0,
    prev_page_url: '',
    to: 0,
    total: 0
}

export const notificationMessage = (type: string, message: string, err: string) => {
    if(type === 'success' || type === 'warning' || type === 'error' || type ==='info')
        notification[type]({ message: message, description: err, duration: 5});
    return;
}

export const loadingIcon = () => {
    return (
        <>
            <LoadingOutlined style={{ fontSize: 40 }} spin />
        </>
    )
}

export const initBEforeUnLoad = (showExitPrompt: any) => {
    window.onbeforeunload = (ev: BeforeUnloadEvent) =>{
        if(showExitPrompt){
            const e = ev || window.event;
            e.preventDefault();
            if(e){
                e.returnValue = '';
            }
            return '';
        }
    }
}