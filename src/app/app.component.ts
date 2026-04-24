import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
  <div style="width:360px;margin:20px auto;background:#f5f5f5;border-radius:22px;overflow:hidden;font-family:Arial;box-shadow:0 4px 15px rgba(0,0,0,0.15);">

    <div style="background:#d32f2f;color:white;text-align:center;padding:22px;">
      <h2 style="margin:0;font-size:26px;">HSK 마스터</h2>
      <p style="margin:6px 0 0;">중국어 완전정복</p>
    </div>

    <!-- 홈 -->
    <div *ngIf="page=='home'" style="padding:22px;text-align:center;">
      <h3>오늘의 단어</h3>
      <div style="font-size:50px;font-weight:bold;">学习</div>
      <div>[xuéxí]</div>
      <div style="margin-bottom:20px;">학습하다, 공부하다</div>

      <button (click)="page='list'" style="width:100%;padding:14px;background:#d32f2f;color:white;border:none;border-radius:12px;margin-top:10px;font-size:16px;">HSK 단어</button>
      <button (click)="page='favorite'" style="width:100%;padding:14px;background:#d32f2f;color:white;border:none;border-radius:12px;margin-top:10px;font-size:16px;">⭐ 내 단어장</button>
      <button (click)="page='idiom'" style="width:100%;padding:14px;background:#d32f2f;color:white;border:none;border-radius:12px;margin-top:10px;font-size:16px;">관용어</button>
      <button (click)="page='chengyu'" style="width:100%;padding:14px;background:#d32f2f;color:white;border:none;border-radius:12px;margin-top:10px;font-size:16px;">사자성어</button>
      <button (click)="page='quiz'" style="width:100%;padding:14px;background:#d32f2f;color:white;border:none;border-radius:12px;margin-top:10px;font-size:16px;">퀴즈 시작</button>
    </div>

    <!-- HSK 단어 -->
    <div *ngIf="page=='list'" style="padding:18px;">
      <h3 style="text-align:center;">HSK 단어</h3>

      <input [(ngModel)]="searchText" placeholder="단어, 병음, 뜻 검색"
        style="width:100%;padding:12px;margin-bottom:12px;border-radius:10px;border:1px solid #ccc;box-sizing:border-box;">

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px;">
        <button *ngFor="let lv of [1,2,3,4,5,6]"
          (click)="selectedLevel=lv"
          [style.background]="selectedLevel==lv ? '#d32f2f' : '#999'"
          style="padding:10px;color:white;border:none;border-radius:10px;">
          {{lv}}급
        </button>
      </div>

      <div *ngFor="let item of filteredWords()"
        (click)="selectedWord=item; page='detail'"
        style="background:white;margin-top:10px;padding:15px;border-radius:14px;box-shadow:0 2px 8px rgba(0,0,0,0.12);cursor:pointer;">

        <div style="font-size:24px;font-weight:bold;">
          {{item.word}} <span style="font-size:14px;color:#888;">[{{item.pinyin}}]</span>
        </div>
        <div style="color:#555;margin-top:5px;">{{item.meaning}}</div>
      </div>

      <button (click)="page='home'" style="width:100%;padding:13px;background:#555;color:white;border:none;border-radius:10px;margin-top:15px;">홈으로</button>
    </div>

    <!-- 상세 -->
    <div *ngIf="page=='detail' && selectedWord" style="padding:22px;text-align:center;">
      <div style="font-size:60px;font-weight:bold;">{{selectedWord.word}}</div>
      <p>[{{selectedWord.pinyin}}]</p>
      <p style="font-size:18px;">{{selectedWord.meaning}}</p>

      <button (click)="speak(selectedWord.word)" style="width:100%;padding:14px;background:#d32f2f;color:white;border:none;border-radius:12px;margin-top:10px;">🔊 발음 듣기</button>

      <button (click)="toggleFavorite(selectedWord)" style="width:100%;padding:14px;background:#d32f2f;color:white;border:none;border-radius:12px;margin-top:10px;">
        {{isFavorite(selectedWord) ? '⭐ 즐겨찾기 해제' : '☆ 즐겨찾기 추가'}}
      </button>

      <div style="background:white;margin-top:18px;padding:16px;border-radius:14px;box-shadow:0 2px 8px rgba(0,0,0,0.12);text-align:left;">
        <b>예문</b>
        <p>{{selectedWord.example}}</p>
        <p style="color:#666;">{{selectedWord.translation}}</p>
      </div>

      <button (click)="page='list'" style="width:100%;padding:13px;background:#555;color:white;border:none;border-radius:10px;margin-top:15px;">목록으로</button>
    </div>

    <!-- 내 단어장 -->
    <div *ngIf="page=='favorite'" style="padding:20px;">
      <h3 style="text-align:center;">⭐ 내 단어장</h3>

      <div *ngIf="favorites.length==0" style="text-align:center;color:#777;margin-top:30px;">
        아직 저장한 단어가 없습니다.
      </div>

      <div *ngFor="let item of favorites"
        (click)="selectedWord=item; page='detail'"
        style="background:white;margin-top:10px;padding:15px;border-radius:14px;box-shadow:0 2px 8px rgba(0,0,0,0.12);">
        <b style="font-size:24px;">{{item.word}}</b> [{{item.pinyin}}]
        <div>{{item.meaning}}</div>
      </div>

      <button (click)="page='home'" style="width:100%;padding:13px;background:#555;color:white;border:none;border-radius:10px;margin-top:15px;">홈으로</button>
    </div>

    <!-- 관용어 -->
    <div *ngIf="page=='idiom'" style="padding:20px;">
      <h3 style="text-align:center;">관용어</h3>
      <div style="background:white;padding:14px;border-radius:12px;margin-top:10px;">一心一意 - 한마음 한뜻</div>
      <div style="background:white;padding:14px;border-radius:12px;margin-top:10px;">三心二意 - 마음이 흔들리다</div>
      <div style="background:white;padding:14px;border-radius:12px;margin-top:10px;">七上八下 - 마음이 불안하다</div>
      <button (click)="page='home'" style="width:100%;padding:13px;background:#555;color:white;border:none;border-radius:10px;margin-top:15px;">홈으로</button>
    </div>

    <!-- 사자성어 -->
    <div *ngIf="page=='chengyu'" style="padding:20px;">
      <h3 style="text-align:center;">사자성어</h3>
      <div style="background:white;padding:14px;border-radius:12px;margin-top:10px;">画龙点睛 - 화룡점정</div>
      <div style="background:white;padding:14px;border-radius:12px;margin-top:10px;">刻舟求剑 - 융통성이 없음</div>
      <div style="background:white;padding:14px;border-radius:12px;margin-top:10px;">守株待兔 - 요행을 기다림</div>
      <button (click)="page='home'" style="width:100%;padding:13px;background:#555;color:white;border:none;border-radius:10px;margin-top:15px;">홈으로</button>
    </div>

    <!-- 퀴즈 -->
    <div *ngIf="page=='quiz'" style="padding:22px;text-align:center;">
      <h3>퀴즈</h3>
      <h2 style="font-size:42px;">苹果</h2>
      <p>뜻은?</p>

      <button (click)="answer='정답입니다!'" style="width:100%;padding:14px;background:#d32f2f;color:white;border:none;border-radius:12px;margin-top:10px;">사과</button>
      <button (click)="answer='오답입니다!'" style="width:100%;padding:14px;background:#d32f2f;color:white;border:none;border-radius:12px;margin-top:10px;">바나나</button>
      <button (click)="answer='오답입니다!'" style="width:100%;padding:14px;background:#d32f2f;color:white;border:none;border-radius:12px;margin-top:10px;">포도</button>

      <p style="font-weight:bold;color:#d32f2f;font-size:18px;">{{answer}}</p>

      <button (click)="page='home'; answer=''" style="width:100%;padding:13px;background:#555;color:white;border:none;border-radius:10px;margin-top:15px;">홈으로</button>
    </div>

    <!-- 광고 -->
    <div style="background:#ff6600;color:white;text-align:center;padding:14px;font-weight:bold;">
      광고 배너 영역
    </div>

  </div>
  `
})
export class AppComponent {

  page = 'home';
  answer = '';
  searchText = '';
  selectedLevel = 1;
  selectedWord:any = null;
  favorites:any[] = [];

  words = [
    {level:1, word:'爱', pinyin:'ài', meaning:'사랑하다', example:'我爱你。', translation:'나는 너를 사랑해.'},
    {level:1, word:'八', pinyin:'bā', meaning:'여덟', example:'八个人。', translation:'여덟 명.'},
    {level:1, word:'爸爸', pinyin:'bàba', meaning:'아빠', example:'我爸爸很好。', translation:'우리 아빠는 좋다.'},
    {level:2, word:'帮助', pinyin:'bāngzhù', meaning:'돕다', example:'我帮助你。', translation:'내가 너를 도와준다.'},
    {level:2, word:'唱歌', pinyin:'chànggē', meaning:'노래하다', example:'她喜欢唱歌。', translation:'그녀는 노래를 좋아한다.'},
    {level:3, word:'安静', pinyin:'ānjìng', meaning:'조용하다', example:'这里很安静。', translation:'여기는 매우 조용하다.'},
    {level:4, word:'爱情', pinyin:'àiqíng', meaning:'사랑', example:'爱情很美。', translation:'사랑은 아름답다.'},
    {level:5, word:'安排', pinyin:'ānpái', meaning:'배치하다, 준비하다', example:'我来安排。', translation:'내가 준비할게.'},
    {level:6, word:'挨', pinyin:'ái', meaning:'견디다', example:'他挨过了困难。', translation:'그는 어려움을 견뎌냈다.'}
  ];

  filteredWords(){
    return this.words.filter(item =>
      item.level === this.selectedLevel &&
      (
        item.word.includes(this.searchText) ||
        item.pinyin.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.meaning.includes(this.searchText)
      )
    );
  }

  toggleFavorite(word:any){
    if(this.isFavorite(word)){
      this.favorites = this.favorites.filter(x => x.word !== word.word);
    } else {
      this.favorites.push(word);
    }
  }

  isFavorite(word:any){
    return this.favorites.some(x => x.word === word.word);
  }

  speak(text:string){
    alert('발음 기능 자리입니다: ' + text);
  }
}