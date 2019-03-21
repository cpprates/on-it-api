import * as AssistantV2 from 'watson-developer-cloud/assistant/v2';


const service = new AssistantV2({
    username: process.env.WATSON_USER,
    password: process.env.WATSON_PWD,
    version: '2018-09-20'
});
const assistantId = process.env.WATSON_ASSISTANT_ID;


export class AssertionService {


    static generateAssertion(messageText: string, sessionId?: string): Promise<string> {

        return new Promise((resolve, reject) => {

            service.createSession({
                assistant_id: assistantId
            }, (err, result) => {
                if (err) {
                    reject("Error creating session! ");
                    console.error(err);
                    return;
                }
                const sessionId = result.session_id;
                service.message({
                    assistant_id: assistantId,
                    session_id: sessionId,
                    input: {
                        message_type: 'text',
                        text: messageText
                    }
                }, (err, response) => {


                    if (err) {
                        reject("Error talking to watson");
                        console.error(err);
                        return;
                    }

                    if (response.output.generic.length != 0) {
                        resolve(response.output.generic[0].text);
                        console.log(`Assertion received: ${response.output.generic[0].text}`)
                    } else {
                        reject("Error. Could not find any affirmation.");
                    }
                });
            });
        });
    }
}