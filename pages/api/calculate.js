// pages/api/calculate.js
export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { gender, age } = req.body;

  const ageNum = parseInt(age, 10);
  if (!['男', '女'].includes(gender) || isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
    res.status(400).json({ error: '請輸入有效性別與1-120之間年齡' });
    return;
  }

  // 九澤對照表
  const jiuzeMale = { 1: "右眉", 2: "鼻", 3: "嘴巴", 4: "右耳", 5: "右眼", 6: "額頭", 7: "左眉", 8: "左眼", 9: "左耳" };
  const jiuzeFemale = { 1: "左眉", 2: "鼻", 3: "嘴巴", 4: "左耳", 5: "左眼", 6: "額頭", 7: "右眉", 8: "右眼", 9: "右耳" };

  // 計算九澤
  const calcJiuze = age => {
    let s = String(age)
      .split('')
      .reduce((sum, digit) => sum + Number(digit), 0);
    const proc = [`${age} = ${String(age).split('').join(' + ')} = ${s}`];
    while (s > 9) {
      const old = s;
      s = String(s)
        .split('')
        .reduce((sum, digit) => sum + Number(digit), 0);
      proc.push(`${old} = ${s}`);
    }
    if (s === 0) s = 9;
    return { digit: s, process: proc };
  };

  // 傳統流年對照表（男性）
  const traditionalMale = { "1": "天輪(左耳輪上)", "2": "天輪(左耳輪上)", "3": "天城(左耳輪)", "4": "天城(左耳輪)", "5": "天廓(左耳輪下)", "6": "天廓(左耳輪下)", "7": "天廓(左耳垂)", "8": "天輪(右耳輪上)", "9": "天輪(右耳輪上)", "10": "人輪(右耳輪)", "11": "人輪(右耳輪)", "12": "地輪(右耳輪下)", "13": "地輪(右耳輪下)", "14": "地輪(右耳垂)", "15": "火星(髮際頂)", "16": "天中(髮際對下)", "17": "日角(左額角)", "18": "月角(右額角)", "19": "天庭(額上)", "20": "輔角(左額角)", "21": "輔角(右額角)", "22": "司空(額中)", "23": "邊城(左太陽穴)", "24": "邊城(右太陽穴)", "25": "中正(額中下)", "26": "丘陵(左眉對出)", "27": "冢墓(右眉對出)", "28": "印堂(眉間)", "29": "山林左(髮際角左)", "30": "山林右(髮際角右)", "31": "凌雲左(左眉頭)", "32": "紫氣右(右眉頭)", "33": "繁霞左(左眉中)", "34": "彩霞右(右眉中)", "35": "太陽左(左眼角)", "36": "太陰右(右眼角)", "37": "中陽左(左眼珠)", "38": "中陰右(右眼珠)", "39": "少陽左(左眼尾)", "40": "少陰右(右眼尾)", "41": "山根(鼻根)", "42": "精舍(左眼角與山根之間)", "43": "光殿(右眼角與山根之間)", "44": "年上(鼻樑上)", "45": "壽上(鼻樑中)", "46": "顴骨左", "47": "顴骨右", "48": "準頭(鼻頭)", "49": "蘭台(左鼻翼)", "50": "廷尉(右鼻翼)", "51": "人中", "52": "仙庫左(人中左)", "53": "仙庫右(人中右)", "54": "食倉(左嘴角對上)", "55": "祿倉(右嘴角對上)", "56": "法令左(左法令紋)", "57": "法令右(右法令紋)", "58": "虎耳左(左顴骨與命門之間)", "59": "虎耳右(右顴骨與命門之間)", "60": "水星(嘴唇)", "61": "承漿(嘴唇下)", "62": "地庫左(承漿左旁)", "63": "地庫右(承漿右旁)", "64": "陂池(左嘴角對出)", "65": "鵝鴨(右嘴角對出)", "66": "金縷左(左法令延伸)", "67": "金縷右(右法令延伸)", "68": "歸來左(左臉垂肉)", "69": "歸來右(右臉垂肉)", "70": "頌堂(下巴上)", "71": "地閣(下巴)", "72": "奴僕左(下巴左)", "73": "奴僕右(下巴右)", "74": "腮骨左", "75": "腮骨右", "76": "子位", "77": "丑位", "78": "寅位", "79": "卯位", "80": "辰位", "81": "巳位", "82": "午位", "83": "未位", "84": "申位", "85": "酉位", "86": "戌位", "87": "亥位", "88": "子位(復)", "89": "丑位(復)", "90": "寅位(復)", "91": "卯位(復)", "92": "辰位(復)", "93": "巳位(復)", "94": "午位(復)", "95": "未位(復)", "96": "申位(復)", "97": "酉位(復)", "98": "戌位(復)", "99": "亥位(復)" };
  // 生成女性版（左右互換）
  const mirror = txt => txt.replace(/左/g, 'XX').replace(/右/g, '左').replace(/XX/g, '右');
  const traditionalFemale = Object.fromEntries(
    Object.entries(traditionalMale).map(([k, v]) => [k, mirror(v)])
  );

  // 計算
  const { digit, proc } = calcJiuze(ageNum);
  const jiuzeTable = gender === "男" ? jiuzeMale : jiuzeFemale;
  const jiuzePart = jiuzeTable[digit];

  const table = gender === "男" ? traditionalMale : traditionalFemale;
  const eff = ageNum <= 99 ? String(ageNum) : String(ageNum - 99);
  const traditionalPart = table[eff] || `第${ageNum}歲部位`;

  res.status(200).json({
    success: true,
    gender, age: ageNum,
    jiuze: { digit, part: jiuzePart, process: proc },
    traditional: { part: traditionalPart }
  });
}
