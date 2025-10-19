// Predefined wishes for the application

export const WISHES = [
  "Chúc nàng một ngày 20/10 tràn ngập yêu thương và tiếng cười! Mong rằng những ước mơ nhỏ bé của nàng đều sẽ trở thành hiện thực, và mỗi ngày đều mang đến cho nàng niềm vui, hạnh phúc cùng những điều bất ngờ đáng yêu nhất! 💐",
  
  "Nhân ngày Phụ nữ Việt Nam 20/10, chúc nàng mãi xinh đẹp, rạng rỡ và tỏa sáng như ánh mặt trời! Hãy luôn giữ nụ cười trên môi và trái tim tràn đầy yêu thương nhé! 🌞",
  
  "Chúc nàng – người phụ nữ tuyệt vời – có một ngày 20/10 thật đáng nhớ! Mong nàng luôn được yêu thương, trân trọng và hạnh phúc trên hành trình của riêng mình. Mỗi bước đi của nàng đều là niềm tự hào của những người xung quanh! 💖",
  
  "20/10 – ngày của yêu thương! Chúc nàng luôn giữ được sự dịu dàng, tinh tế và niềm tin mạnh mẽ trong tim. Dù cuộc sống có bận rộn đến đâu, hãy luôn dành cho mình những phút giây bình yên và hạnh phúc nhé! 🌷",
  
  "Chúc nàng 20/10 thật ý nghĩa, được nhận nhiều lời chúc tốt đẹp, nhiều món quà dễ thương và thật nhiều niềm vui. Mong mọi điều nàng mong ước đều sớm trở thành hiện thực! 🎁",
  
  "Chúc nàng luôn xinh đẹp, hạnh phúc và thành công không chỉ trong ngày 20/10 mà trong suốt 365 ngày còn lại! Cảm ơn nàng vì đã lan tỏa năng lượng tích cực và yêu thương đến mọi người xung quanh. 🌼",
  
  "20/10 là dịp đặc biệt để nói rằng: Nàng là người phụ nữ tuyệt vời! Mong nàng luôn giữ được ngọn lửa đam mê trong công việc, sự dịu dàng trong tâm hồn và tình yêu thương trong cuộc sống. 🌸",
  
  "Chúc nàng có một ngày 20/10 ngọt ngào như những bông hoa sớm mai, rực rỡ như ánh nắng mùa thu và hạnh phúc như chính nụ cười của nàng. Hãy tận hưởng ngày hôm nay thật trọn vẹn nhé! 🌹",
  
  "Mỗi người phụ nữ đều là một bông hoa đẹp theo cách riêng của mình – và nàng chính là đóa hoa khiến thế giới này trở nên dịu dàng hơn. Chúc nàng 20/10 thật rực rỡ và tràn đầy năng lượng! 🌺",
  
  "Nhân ngày 20/10, chúc nàng luôn có niềm tin vững vàng, sức khỏe dồi dào và tâm hồn thật bình an. Hãy luôn yêu thương bản thân và sống hết mình với những điều nàng đam mê nhé! ✨"
] as const;

export function getRandomWish(): string {
  return WISHES[Math.floor(Math.random() * WISHES.length)];
}
