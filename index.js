var readlineSync = require('readline-sync')
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

let C = new Consumer(null,
    new ConsumerConfiguration(
        {   events: [new Event('test')],
            dependency: 
            { 
                processAfter: {} 
        }, name: 'C' }),
    (self,data,err) => {
        if(err) {console.log(err);}
        else {
            //Re-Register Depedency
            // C.addDepenedency(A)
            // C.addDepenedency(B)
            console.log(self._id,self.getName())
        }
    })
    
let A = new Consumer(null,
    new ConsumerConfiguration(
            {   
                events: [new Event('test')],
                dependency: { 
                        processAfter: {
                           // [id1]: consumer1
                        }
                    }, name: 'A' 
            }
        ),
    (self,data,err) => {
        if(err) {console.log(err);}
        else {
            //Re-Register Dependecy
            //A.addDepenedency(B)
            console.log(self._id,self.getName())
        }
    })

    let B = new Consumer(null,
        new ConsumerConfiguration(
                {   events: [new Event('test')],
                    dependency: { 
                            processAfter: {
                               // [id1]: consumer1
                            }
                        }, name: 'B' 
                }
            ),
        (self,data,err) => {
            if(err) {console.log(err);}
            else 
                console.log(self._id,self.getName())
        })

/*  Deadlock      
        C.addDepenedency(A)
        C.addDepenedency(B)
        A.addDepenedency(B)
        B.addDepenedency(A)
*/

/*  C-> (A,B)      
        C.addDepenedency(A)
        C.addDepenedency(B)
        A.addDepenedency(B)
*/

      
C.addDepenedency(A)
C.addDepenedency(B)
A.addDepenedency(B)

//setTimeout(()=>{
    C.startConsuming()
    A.startConsuming()
    B.startConsuming()
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
    .startEvents((sendEvent,error) => {
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

            },2000)
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