import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const LEMBRETE_ID = 'lembrete-diario';
const CANAL_ID = 'lembretes';

//------Define como a notificação aparece se chegar com o app aberto------
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

//------Função para garantir permissão------
async function garantirPermissao(): Promise<boolean>{
    const atual = await Notifications.getPermissionsAsync();
    if (atual.granted) return true;
    if (!atual.canAskAgain) return false;

    const nova = await Notifications.requestPermissionsAsync();
    return nova.granted;
}

//------Função para agendar o lembrete diariamente as 8h------
export async function agendarLembreteDiario(hora = 8, minuto = 0) {
    if (Platform.OS === 'android'){
        await Notifications.setNotificationChannelAsync(CANAL_ID, {
            name: 'Lembretes diários',
            importance: Notifications.AndroidImportance.DEFAULT,
        });
    }
    if (!(await garantirPermissao())) return;

    //Cancela antes para nunca duplicar o agendamento
    await Notifications.cancelScheduledNotificationAsync(LEMBRETE_ID);

    await Notifications.scheduleNotificationAsync({
        identifier: LEMBRETE_ID,
        content: {
            title: 'Hora de praticar!',
            body: 'Vamos resolver algumas operações hoje no NumeraMente?',
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: hora,
            minute: minuto,
            channelId: CANAL_ID, //usa só se for android
        },
    });
}

//------Função para cancelar o envio de lembretes------
export async function cancelarLembreteDiario(){
    await Notifications.cancelScheduledNotificationAsync(LEMBRETE_ID);
}