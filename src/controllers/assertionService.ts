import * as AssistantV2 from 'watson-developer-cloud/assistant/v2';


const service = new AssistantV2({
    iam_apikey: 'auto-generated-apikey-c7eaa7f9-d442-4177-8a32-7227a6bbcf64',
    version: '2018-09-20'
});
const assistantId = 'db4c64cc-ceb7-4edc-bef7-346073b98546';


class AssertionService {


    static generateAssertion(messageText: string): Promise<string> {

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

                    console.log(response);

                    // Display the output from assistant, if any. Assumes a single text response.
                    if (response.output.generic.length != 0) {
                        resolve(response.output.generic[0].text);
                        console.log(`Assertion received: ${response.output.generic[0].text}`)
                    }


                });
            });

        });


    }

}