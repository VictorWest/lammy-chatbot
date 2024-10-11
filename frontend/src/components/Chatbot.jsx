import { useState, useEffect } from "react";
import {TailSpin} from 'react-loader-spinner'
import { formatBoldText } from "../utils/formatText";
import Offline from "./Offline";

export default function Chatbot(){
  const [ output, setOutput ] = useState()
  const [canStop, setCanStop] = useState(false)
  const [ isLoading, setIsLoading ] = useState(false)
  const [ synth, setSyth ] = useState(window.speechSynthesis)
  const [ error, setError ] = useState(false)
  const [ isOnline, setIsOnline ] = useState(navigator.onLine)

  const runSpeechRecog = () => {
    setIsLoading(true)
    setOutput("")
    let recognization = new webkitSpeechRecognition();
      recognization.onstart = () => {
        setOutput("Listening")
        setTimeout(() => {
          setIsLoading(false)
        }, 20000)
      }
      recognization.onresult = (e) => {
        setOutput("Loading a response")
          var transcript = e.results[0][0].transcript;
          fetch("http://localhost:3000/", {
            method: 'POST',
            body: JSON.stringify({transcript: transcript}),
            headers: {
                'Content-Type': 'application/json'
            }
          })
          .then((res) => {
            console.log(res.message);
            if(!res.ok){
              setError(true)
              setTimeout(() => {
                setError(false)
              }, 2000)
            }
            return res.json()
          }).then((data) => {
            setIsLoading(false)
            setCanStop(true)
            const refinedData = formatBoldText(data.message)
            setOutput(refinedData);
            const utterThis = new SpeechSynthesisUtterance(data.message);
            synth.speak(utterThis);
          })
          .catch((err) => {
            setError(true)
            setIsLoading(false)
          })
      }
      recognization.start();      
  }
  const stopSpeech = () => {
    synth.cancel()
    setCanStop(false)
  }
  
  useEffect(() => {
    // Event listeners for online and offline
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup listeners when component unmounts
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <main>
      <div className="flex flex-col gap-3 items-center">
        <img src="gemini.png" alt="gemini logo" className="rounded w-20 mt-5"/>
        <h1 className="text-stone-300 font-bold text-3xl text-center pt-5">A CONVERSATION <br/> WITH GEMINI</h1>        
      </div>
      {
        isOnline ? 
      <div className="flex flex-col justify-center mt-40 items-center">
          {canStop ? 
            <button className="bg-[#614cee] px-3 py-1 rounded-md text-[#fff] hover:" onClick={stopSpeech}>
              <i class="fa-solid fa-stop text-4xl p-2"></i>
            </button>
            :
            <button onClick={runSpeechRecog} className="bg-[#614cee] px-3 py-1 text-[#fff] hover:rounded-md">
              {isLoading ?
                <div className="flex gap-2" onClick={() => setIsLoading(prev => !prev)}>
                <p>{output}</p> 
                <TailSpin
                  visible={true}
                  height="30"
                  width="30"
                  color="#fff"
                  ariaLabel="tail-spin-loading"
                  radius="1"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              </div>
              : <i className="fa-solid fa-microphone text-4xl p-2"></i>}
            </button>
          }
          {canStop && <h3 id="output" className="text-[#fff] m-3 p-2 text-center bg-[#364F6B]">{output}</h3>}
          {error && 
            <h3 id="error" className="text-[#fff] m-3 p-2 text-center bg-[#364F6B]">
              There was an Error. Try again
            </h3>
          }
      </div>
      :
      <Offline/>
      }
    </main>
  );
};
