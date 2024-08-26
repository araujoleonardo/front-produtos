import {ElNotification} from "element-plus";

function alertValidate(error) {
    if (!error.response)
    {
        console.error(error);
        return;
    }

    if (error.response.status === 422)
    {
        let msg = ''

        try {
            for (let item in error.response.data.errors) {
                msg += error.response.data.errors[item][0] + '<br>'
            }
        } catch (e) {
            console.error(error);
            return;
        }

        ElNotification.warning({
            title: 'Alerta',
            dangerouslyUseHTMLString: true,
            message: msg,
            offset: 50,
        });
        return;
    }

    if (error.response.status >= 500)
    {
        ElNotification.error({
            title: 'Erro',
            message: 'Ops! Tente mais tarde.',
            offset: 50,
        });
    }
}

export default alertValidate;