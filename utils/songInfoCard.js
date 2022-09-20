const { Canvas, Image } = require('skia-canvas');
const allSources = [
  {
    name: 'SC',
    aliases: ["soundcloud"],
    text: "Soundcloud",
    url: 'https://cdn.discordapp.com/emojis/988453864565014538.png',
    img: new Image(),
  },
  {
    name: 'SP',
    aliases: ["spotify"],
    text: "Spotify",
    url: 'https://cdn.discordapp.com/emojis/988453862841122909.png',
    img: new Image(),
  },
  {
    name: 'YT',
    aliases: ["youtube"],
    text: "Youtube",
    url: 'https://cdn.discordapp.com/emojis/988453865802330192.png',
    img: new Image(),
  },
  {
    name: 'YTM',
    aliases: ["musicyoutube", "youtubemusic", "music youtube"],
    text: "Youtube Music",
    url: 'https://cdn.discordapp.com/emojis/988786012505374761.png',
    img: new Image(),
  },
  {
    name: 'applemusic',
    aliases: ["am", "musicapple", "apple music", "music apple"],
    text: "AppleMusic",
    url: 'https://cdn.discordapp.com/emojis/1018176501335740436.png',
    img: new Image(),
  },
  {
    name: 'bandcamp',
    aliases: ["bc"],
    text: "Bandcamp",
    url: 'https://cdn.discordapp.com/emojis/1018175632347234414.png',
    img: new Image(),
  },
  {
    name: 'deezer',
    aliases: ["dz"],
    text: "Deezer",
    url: 'https://cdn.discordapp.com/emojis/1018174807092760586.png',
    img: new Image(),
  },
  {
    name: 'reddit',
    aliases: ["rd"],
    text: "Reddit",
    url: 'https://cdn.discordapp.com/emojis/1018185730410950697.png',
    img: new Image(),
  },
  {
    name: 'twitch',
    aliases: ["tw"],
    text: "Twitch",
    url: 'https://cdn.discordapp.com/emojis/1018174515655749643.png',
    img: new Image(),
  },
  {
    animated: false,
    name: 'vimeo',
    id: '1018175316075761755',
    url: 'https://cdn.discordapp.com/emojis/1018175316075761755.png',
    img: new Image(),
  },
  {
    name: 'DC',
    id: '988722811642200064',
    aliases: ["discord"],
    text: "Discord-Local",
    url: 'https://cdn.discordapp.com/emojis/988722811642200064.png',
    img: new Image(),
  }
];
const milratoAvatar = "https://cdn.discordapp.com/avatars/734513783338434591/8cd4d5ce779367d5eed8193c99ebdf3e.png";
class songInfoCard {
  constructor({debug}={}) {
    this.allSources = allSources;
    this.mark = new Image();
    this.init();
    this.debug = debug ?? true;
  } 
  async init() {
    if(this.debug) console.log("initalizing currentSongInfoCard");
    this.mark.src = milratoAvatar;
    await this.mark.decode();
    for (const s of this.allSources) {
      try {
        s.img.src = s.url;
        await s.img.decode();
      } catch (e) {
        s.img = null;
        console.error(e);
      }
    }
    if(this.debug) console.log("currentSongInfoCard initated");
  }
  /**
    * @param { {thumbnail:string, title:string, duration:string, author:string, source:string} } inputData
  */
  async generate(inputData = {}) {
    const {
      thumbnail, title, duration, author, source
    } = inputData;
    const canvas = new Canvas(1000, 250), { width, height } = canvas, ctx = canvas.getContext("2d");

    ctx.fillStyle = "#4E84F1";
    await this.roundRect(ctx, 0, 0, canvas.width, canvas.height, 25, true, false);

    if (thumbnail) {
      const dWidth = 355.5555555555556;
      const dHeight = 200;
      await this.roundRect(ctx, 25, 25, dWidth - 50, dHeight, 15, false, true, async (c) => {
        try {
          let img = new Image(); img.src = thumbnail;
          await img.decode();
          c.clip();
          c.drawImage(img, 0, 25, dWidth, dHeight);
        } catch { }
        return;
      });
    }

    if (title) {
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "40px bold";
      ctx.fillText(title, 400, 25 + 30 + 35, canvas.width - 25);
    }
    if (author) {
      ctx.fillStyle = "#2C2C2C";
      ctx.font = "20px bold";
      ctx.fillText(author, 400, 75 + 10 + 35, canvas.width - 25);
    }
    if (duration) {
      ctx.font = "25px bold";
      const measurements = ctx.measureText(duration);
      ctx.fillStyle = "#8FB4FF";
      await this.roundRect(ctx, 400, 195 - 35, measurements.width + 30, 30, 10, true, false);
      ctx.fillStyle = "#2C2C2C";
      ctx.fillText(duration, 400 + 15, 195 + 22.5 - 35);
    }
    if (source) {
      const theSource = this.allSources.filter(x => x.img).find(x => x.name.toLowerCase() == source.toLowerCase() || x.aliases?.includes(source.toLowerCase()));
      if (theSource) {
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "30px bold";
        const text = theSource.text;
        const img = theSource.img;
        const textWidth = ctx.measureText(text).width;
        ctx.drawImage(img, (canvas.width - 50 - 25 - textWidth - 25 - 50), (canvas.height - 50 - 25), 50, 50);
        ctx.fillText(text, canvas.width - 50 - 25 - textWidth - 50 + 30, (canvas.height - 50) + 10)
      }
    }
    ctx.drawImage(this.mark, canvas.width - 50 - 25, canvas.height - 50 - 25, 50, 50)
    return await canvas.toBuffer("png");
  }
  roundRect(ctx, x, y, width, height, radius = 5, fill = false, stroke = true, callback) {
  ctx.save();
  if (typeof radius === 'number') {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    radius = { ...{ tl: 0, tr: 0, br: 0, bl: 0 }, ...radius };
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (callback) {
    await callback(ctx);
  }
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
  ctx.restore();
  return true;
}
}
