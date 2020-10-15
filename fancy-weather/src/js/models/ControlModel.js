import ControlView from '../views/ControlView';
import { getTranslation } from '../utils/utility';
import { getWeatehrText } from '../utils/weather-helpers';

export default class ControlModel {
  constructor(container) {
    this.container = container;
    this.view = new ControlView(this);
    this.isRecognitionActive = false;
  }

  render() {
    this.view.render(this.container);
  }

  get inputValue() {
    return this.view.inputValue;
  }

  changeLanguage() {
    this.view.setTranslation();
    if (this.recognition) {
      this.recognition.lang = document.documentElement.lang;
    }
  }

  setVoiceNotification(weatherInfo) {
    const { placename, currentWeather, forecast } = weatherInfo;
    const synth = window.speechSynthesis;

    synth.getVoices();
    this.msg = new SpeechSynthesisUtterance();
    this.msg.text = getWeatehrText(placename, currentWeather, forecast);
    this.msg.onend = () => this.toggleVoiceButton(false);

    return this.setVoice();
  }

  setVoice() {
    let { language } = localStorage;
    if (language === 'en') {
      language = 'en-US';
    }
    const voicesArr = speechSynthesis.getVoices()
      .filter((item) => item.lang.includes(language));
    this.msg.voice = voicesArr[voicesArr.length - 1];
  }

  get msgVoice() {
    return this.msg.voice;
  }

  clearInput() {
    this.view.clearInput();
  }

  showErrorMessage(errorMessage) {
    this.view.showErrorMessage(errorMessage);

    setTimeout(() => {
      this.view.clearInput();
    }, 4000);
  }

  toggleSpeechRecognition() {
    if (this.isRecognitionActive) {
      this.view.toggleButton(false, 'speech');
      this.isRecognitionActive = false;
      return this.recognition.abort();
    }
    this.view.toggleButton(true, 'speech');
    return this.startRecognizeSpeech();
  }

  toggleVoiceButton(isActive) {
    this.view.toggleButton(isActive, 'voice');
  }

  startRecognizeSpeech() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    this.recognition = recognition;
    recognition.lang = document.documentElement.lang;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.addEventListener('result', (e) => {
      const transcriptArr = Array.from(e.results[0])
        .map((alt) => alt.transcript);
      if (e.results[0].isFinal) {
        this.сheckSpeechResult(transcriptArr[0]);
      }
    });

    recognition.addEventListener('end', () => {
      if (this.isRecognitionActive) {
        return recognition.start();
      }
      return recognition.stop();
    });

    this.isRecognitionActive = true;
    recognition.start();
  }

  сheckSpeechResult(result) {
    const { keyWords } = getTranslation();

    if (result.includes(keyWords.weather)
    || result.includes(keyWords.forecast)) {
      return document.querySelector('.voice-notification').click();
    }

    if (result.includes(keyWords.louder)) {
      if (this.msg.volume <= 0.8) {
        this.msg.volume += 0.2;
      }
      return 1;
    }
    if (result.includes(keyWords.quieter)) {
      if (this.msg.volume >= 0.2) {
        this.msg.volume -= 0.2;
      }
      return 1;
    }
    return this.searchCity(result);
  }

  searchCity(city) {
    this.view.submitFormWitchValue(city);
  }
}
