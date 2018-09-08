const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

let {
    QueueConfiguration,
    ConsumerConfiguration,
    ProducerConfiguration,
    Dependency
} = require('./config');

let { Queue, Consumer, Producer, Message, Context, Event } = require('./models');

let queue = (new Queue([], new QueueConfiguration({ size: 10 }))).getQueue()

let A = new Consumer(null,
    new ConsumerConfiguration(
        {   events: [new Event('event')],
            dependency: 
            { 
                processAfter: {} 
        }, name: 'A' }),
    (self,message,err) => {
        if(err) {console.log(err);}
        else {
            //Re-Register Depedency
            // C.addDepenedency(A)
            // C.addDepenedency(B)
            //console.log(self._id,self.getName(),message.getEvent().getName())
        }
    })
    
let C = new Consumer(null,
    new ConsumerConfiguration(
            {   
                events: [new Event('event')],
                dependency: { 
                        processAfter: {
                           // [id1]: consumer1
                        }
                    }, name: 'C' 
            }
        ),
    (self,message,err) => {
        if(err) {console.log(err);}
        else {
            //Re-Register Dependecy
            //A.addDepenedency(B)
            //console.log(self._id,self.getName(),message.getEvent().getName())
        }
    })

    let B = new Consumer(null,
        new ConsumerConfiguration(
                {   events: [new Event('event')],
                    dependency: { 
                            processAfter: {
                               // [id1]: consumer1
                            }
                        }, name: 'B' 
                }
            ),
        (self,message,err) => {
            if(err) {console.log(err);}
            else {
                //console.log(self._id,self.getName(),message.getEvent().getName())
            }
        })

/*  Deadlock      
        C.addDepenedency(A)
        C.addDepenedency(B)
        A.addDepenedency(B)
        B.addDepenedency(A)
        setTimeout(()=>{
            B.removeDependency(A)
        },2000)
*/

/*  C-> (A,B)      
        C.addDepenedency(A)
        C.addDepenedency(B)
*/

      
// C.addDepenedency(A)
// C.addDepenedency(B)
// A.addDepenedency(B)

//setTimeout(()=>{
//},500)
// setTimeout(()=>{
//     A.startConsuming()
// },500)
// setTimeout(()=>{
//     B.startConsuming()
// },500)

let events = [
    'test',
    'A',
    'B'
]

let counter = 0;
let producer = (new Producer())
// producer.sendEvent(new Message(
//                         { 
//                             'data': 'This is an example message'+(++counter) 
//                         }
//                         ,new Event('event')
//                     ),(e,d)=>{
//                         // console.log(Context.getQueue())
//                         // console.log(e,d)
//                     })
// producer.sendEvent(new Message(
//     { 
//         'data': 'This is an example message'+(++counter) 
//     }
//     ,new Event('event')
// ),(e,d)=>{
//     // console.log(Context.getQueue())
//     // console.log(e,d)
// })
// producer.sendEvent(new Message(
//     { 
//         'data': 'This is an example message'+(++counter) 
//     }
//     ,new Event('event')
// ),(e,d)=>{
//     // console.log(Context.getQueue())
//     // console.log(e,d)
// })


B.startConsuming()
C.startConsuming()
A.startConsuming()

producer.startEvents((sendEvent,error) => {
    // rl.on('line', (answer) => {
    //     if(answer!='N'){
    //         sendEvent(
    //             new Message(
    //                 { 
    //                     'data': 'This is an example message'+(++counter) 
    //                 }
    //                 ,new Event(answer)
    //             )
    //         )
    //     }
    // });
    try {
        setTimeout(()=>{
            sendEvent(
                new Message(
                    { 
                        'data': 'This is an example message'+(++counter) 
                    }
                    ,new Event('test')
                )
            )

        },500)
    } catch(e) {
        console.log(e)
    }
    // setTimeout(()=>{
    //     sendEvent(
    //         new Message(
    //             { 
    //                 'data': 'This is an example message'+(++counter) 
    //             }
    //             ,new Event(events[Math.floor(Math.random() * Math.floor(events.length-1))])
    //         )
    //     )
    // },2000)
}, (err) => {
    console.log(err)
})