import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import recognizeMicrophone from 'watson-speech/speech-to-text/recognize-microphone';

import { Message, Context, Attachment, Generic } from '@app/models';
import { AssistantService } from '@app/assistant/services';
import { SttService } from '@app/assistant/services';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss']
})
export class MessageFormComponent implements OnInit {
  @Input()
  messages: Message[];
  @Input()
  message: Message;
  context: Context;

  @Input()
  firstDisplayed;
  @Output()
  firstDisplayedChange = new EventEmitter<boolean>();

  @Input()
  labelClicked;

  constructor(private assistantService: AssistantService, private sttService: SttService) {}

  ngOnInit() {
    this.message = new Message();
    if (this.firstDisplayed) {
      this.assistantService.message('', null).subscribe(async data => {
        this.firstDisplayedChange.emit(false);
        this.displayDots('watson');
        await this.displayMessage(data.output.text[0]);
      });
    }

    this.labelClicked.subscribe((text) => {
      this.onLabelClicked(text);
    });

    this.sttService.getToken().subscribe(token => {
      recognizeMicrophone(token);
    });

  }



  sendMessage() {
    // send the user message
    this.message.sentBy = 'user';
    this.messages.push(this.message);
    this.scroll();

    // Get Watson's response from the Assistant Service
    this.assistantService.message(this.message.text, this.context).subscribe(async data => {
      this.context = data.context;

      // If the message is sent by Discovery
      if (data.output.attachment) {
        this.displayDots('discovery');
        await this.displayDiscoveryMessage(data.output.attachment);
      } else {
        if (data.output.generic[0].response_type === 'option') {
          this.displayDots('option');
          await this.displayOptions(data.output.generic[0]);
        } else {
          for (const textstr of data.output.text) {
            this.displayDots('watson');
            await this.displayMessage(textstr);
          }
        }
      }
    });

    // Create a new message to clear the input
    this.message = new Message();
  }

  displayOptions(generic: Generic): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        this.messages[this.messages.length - 1].text = generic.title;
        this.messages[this.messages.length - 1].description = generic.description;
        this.messages[this.messages.length - 1].options = generic.options;
        this.scroll();
        resolve();
      }, generic.title.length * 60 > 3000 ? 3000 : generic.title.length * 60);
    });
  }

  displayDots(sentBy: string): void {
    this.messages.push(new Message('...', sentBy));
    this.scroll();
  }

  displayMessage(textstr: string): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        this.messages[this.messages.length - 1].text = textstr;
        this.scroll();
        resolve();
      }, textstr.length * 60 > 3000 ? 3000 : textstr.length * 60);
    });
  }

  displayDiscoveryMessage(attachment: Attachment): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        this.messages[this.messages.length - 1].text = 'Voici ce que j\'ai trouvé dans ma base documentaire';
        this.messages[this.messages.length - 1].url = attachment.url;
        this.messages[this.messages.length - 1].title = attachment.title;
        this.scroll();
        resolve();
      }, attachment.title.length * 60 > 3000 ? 3000 : attachment.title.length * 60);
    });
  }

  onLabelClicked(text: string) {
    this.message.text = text;
    this.sendMessage();
  }

  scroll() {
    const messages = document.getElementById('scroll');
    setTimeout(() => {
      messages.scrollTo({
        top: messages.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  }

}
