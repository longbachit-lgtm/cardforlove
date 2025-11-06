import { useState, useEffect } from "react";
import { Heart, Calendar, Youtube, Share2, Download, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format, differenceInDays } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import valentineBg from "@/assets/valentine-bg.jpg";
import { useToast } from "@/hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import { getCardById } from "@/services/api";
import { textAlign } from "html2canvas/dist/types/css/property-descriptors/text-align";

// SEO/Meta tags head management
import { Helmet } from "react-helmet";

interface CardData {
  _id: string;
  person_one: string;
  img_person_one: string;
  person_two: string;
  img_person_two: string;
  start_date: string;
  url_youtube: string;
  message: string;
  createdAt: string;
}

const CardDisplay = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [daysInLove, setDaysInLove] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCard = async () => {
      if (!id) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        const response = await getCardById(id);
        setCardData(response.data);
      } catch (error) {
        console.error('Error fetching card:', error);
        toast({
          title: "Lỗi tải thiệp",
          description: "Không thể tải thiệp Valentine. Vui lòng thử lại.",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [id, navigate, toast]);

  useEffect(() => {
    if (cardData?.start_date) {
      try {
        const startDate = new Date(cardData.start_date);
        if (!isNaN(startDate.getTime())) {
          const days = differenceInDays(new Date(), startDate);
          setDaysInLove(days >= 0 ? days : 0);
        } else {
          setDaysInLove(0);
        }
      } catch (error) {
        console.error('Error calculating days:', error);
        setDaysInLove(0);
      }
    }
  }, [cardData?.start_date]);

  const getYoutubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Không xác định";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Không xác định";
      return format(date, "dd/MM/yyyy", { locale: vi });
    } catch (error) {
      return "Không xác định";
    }
  };

  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return "Không xác định";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Không xác định";
      return format(date, "dd/MM/yyyy ", { locale: vi });
    } catch (error) {
      return "Không xác định";
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/card/${cardData._id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Thiệp Valentine của chúng ta 💕",
          text: cardData.message,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Đã copy link!",
        description: "Link thiệp đã được copy vào clipboard.",
      });
    }
  };

  const handleDownload = () => {
    // Tạo canvas để export card thành ảnh
    const cardElement = document.getElementById('valentine-card');
    if (!cardElement) return;

    // Sử dụng html2canvas để chụp ảnh
    import('html2canvas').then(html2canvas => {
      html2canvas.default(cardElement, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `valentine-card-${cardData._id}.png`;
        link.href = canvas.toDataURL();
        link.click();

        toast({
          title: "Tải xuống thành công!",
          description: "Thiệp Valentine đã được tải xuống.",
        });
      });
    });
  };

  // Tạo các giá trị SEO phù hợp
  let metaTitle = "Thiệp Valentine của chúng ta 💖";
  let metaDescription = "Một lời nhắn yêu thương gửi tới người ấy, xem thiệp Valentine online.";
  let ogImage = `${window.location.origin}${valentineBg}`;
  let ogUrl = window.location.href;

  if (cardData) {
    metaTitle = `Thiệp Valentine: ${cardData.person_one || "Em"} 💖 ${cardData.person_two || "Anh"}`;
    // Ghép những thông tin thân mật hơn nếu có
    metaDescription = cardData.message
      ? `💌 ${cardData.person_one || 'Em'} gửi tới ${cardData.person_two || 'Anh'}: "${cardData.message}"`
      : "Xem thiệp Valentine của chúng ta!";
    // Nếu có ảnh của hai người, ưu tiên ảnh của hai người ghép, nếu không thì ảnh người 1, nếu không thì ảnh người 2
    if (cardData.img_person_one && cardData.img_person_two) {
      // Có cả hai ảnh: tạo ảnh ghép hoặc dùng ảnh người 1 làm đại diện (do không xử lý ảnh ghép tại đây)
      ogImage = cardData.img_person_one;
    } else if (cardData.img_person_one) {
      ogImage = cardData.img_person_one;
    } else if (cardData.img_person_two) {
      ogImage = cardData.img_person_two;
    } else {
      ogImage = `${window.location.origin}${valentineBg}`;
    }
    ogUrl = `${window.location.origin}/card/${cardData._id}`;
  }

  if (loading) {
    // Khi loading, vẫn nên gửi meta cho bot tránh bị thiếu title hình ảnh khi preview, nên vẫn render Helmet
    return (
      <>
        <Helmet>
          <title>{metaTitle}</title>
          <meta name="description" content={metaDescription} />
          <meta property="og:title" content={metaTitle} />
          <meta property="og:description" content={metaDescription} />
          <meta property="og:image" content={ogImage} />
          <meta property="og:url" content={ogUrl} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={metaTitle} />
          <meta name="twitter:description" content={metaDescription} />
          <meta name="twitter:image" content={ogImage} />
        </Helmet>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Đang tải thiệp Valentine...</p>
          </div>
        </div>
      </>
    );
  }

  if (!cardData) {
    return (
      <>
        <Helmet>
          <title>{metaTitle}</title>
          <meta name="description" content={metaDescription} />
          <meta property="og:title" content={metaTitle} />
          <meta property="og:description" content={metaDescription} />
          <meta property="og:image" content={ogImage} />
          <meta property="og:url" content={ogUrl} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={metaTitle} />
          <meta name="twitter:description" content={metaDescription} />
          <meta name="twitter:image" content={ogImage} />
        </Helmet>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Không tìm thấy thiệp</h1>
            <Button onClick={() => navigate('/')}>Về trang chủ</Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={ogUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${valentineBg})` }}
        />

        {/* Floating hearts decoration */}
        <div className="fixed inset-0 -z-5 pointer-events-none overflow-hidden">
          <Heart className="absolute top-20 left-[10%] text-primary/20 w-12 h-12 animate-float" />
          <Heart className="absolute top-40 right-[15%] text-secondary/20 w-16 h-16 animate-float-slow" />
          <Heart className="absolute bottom-32 left-[20%] text-accent/20 w-10 h-10 animate-float" />
          <Heart className="absolute bottom-20 right-[25%] text-primary/20 w-14 h-14 animate-float-slow" />
        </div>

        <div className="container mx-auto px-4 py-12 max-w-4xl relative z-10">
          {/* Header */}

          <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-700">


            <p className="text-lg text-muted-foreground">
              {/* Được tạo vào {formatDateTime(cardData.createdAt)} */}
            </p>
          </div>
          {/* Main Card */}
          <Card
            id="valentine-card"
            className="p-8 gradient-card shadow-romantic backdrop-blur-sm border-primary/20 animate-in fade-in slide-in-from-bottom duration-700"
          >
            <div className="flex justify-center mb-4">
              <div className="title-card-love" >
                <div className="  font-bold mb-4 bg-gradient-romantic bg-clip-text text-transparent" style={{ marginRight: '5px', textAlign: "center" }}>
                  <span style={{ color: "#ff3399", background: "none", WebkitBackgroundClip: "unset", WebkitTextFillColor: "unset" }}>
                    Thiệp Valentine của chúng ta <span style={{ color: "#ff6699", background: "none" }}>💝</span>
                  </span>
                </div>
              </div>
              <style>
                {`
                   .title-card-love{
                    display:flex;
                    margin: 35px 0;
                    font-size: 2.3rem;
                
                    }

                    .title-card-love .icon{
                        position: relative;
                        top: -2px;
                        font-size: 33px;
                        }

                  `}
              </style>
            </div>
            {/* Images Section */}
            <div
              className="
                flex justify-center items-end gap-6 flex-wrap custom-preview-row mb-8
                [@media(max-width:443px)]:flex-col [@media(max-width:443px)]:items-center [@media(max-width:443px)]:gap-2
              "
            >
              {/* Person 1 */}
              {(cardData.img_person_one || cardData.person_one) && (
                <div className="flex flex-col items-center group">
                  <div className="relative group">
                    {cardData.img_person_one ? (
                      <>
                        <div className="absolute -inset-1 bg-gradient-romantic rounded-full blur opacity-50 group-hover:opacity-75 transition-smooth"></div>
                        <img
                          src={cardData.img_person_one}
                          alt={cardData.person_one || "Em"}
                          className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-card shadow-soft"
                        />
                      </>
                    ) : (
                      <div className="w-32 h-32 md:w-40 md:h-40 flex justify-center items-center rounded-full bg-muted/50 border-2 border-dashed border-primary/30 text-muted-foreground text-sm italic">
                        Chưa có ảnh
                      </div>
                    )}
                  </div>
                  <div className="mt-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium min-w-[80px] text-center shadow-soft">
                    {cardData.person_one || "Em"}
                  </div>
                </div>
              )}

              {(cardData.img_person_one || cardData.person_one) && (cardData.img_person_two || cardData.person_two) && (
                <Heart
                  className="
                    w-10 h-10 text-primary animate-pulse
                    [@media(max-width:443px)]:my-3
                  "
                />
              )}

              {/* Person 2 */}
              {(cardData.img_person_two || cardData.person_two) && (
                <div className="flex flex-col items-center group">
                  <div className="relative group">
                    {cardData.img_person_two ? (
                      <>
                        <div className="absolute -inset-1 bg-gradient-romantic rounded-full blur opacity-50 group-hover:opacity-75 transition-smooth"></div>
                        <img
                          src={cardData.img_person_two}
                          alt={cardData.person_two || "Anh"}
                          className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-card shadow-soft"
                        />
                      </>
                    ) : (
                      <div className="w-32 h-32 md:w-40 md:h-40 flex justify-center items-center rounded-full bg-muted/50 border-2 border-dashed border-primary/30 text-muted-foreground text-sm italic">
                        Chưa có ảnh
                      </div>
                    )}
                  </div>
                  <div className="mt-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium min-w-[80px] text-center shadow-soft">
                    {cardData.person_two || "Anh"}
                  </div>
                </div>
              )}
            </div>

            {/* Days Counter */}

            <div className="text-center py-2">
              <div className="text-2xl font-semibold text-foreground mb-1 mt-4">
                Chúng ta đã yêu nhau
              </div>
              <div className="text-4xl font-bold text-primary mt-1 mb-1">
                {daysInLove} ngày
              </div>
            </div>

            <div className="text-center mb-8">

              <p className="text-muted-foreground mt-2">
                Kể từ ngày {formatDate(cardData.start_date)}
              </p>
            </div>

            {/* Love Message */}
            {cardData.message && (
              <div className="text-center mb-8 p-6 bg-gradient-to-r from-pink-50 to-red-50 rounded-lg border border-primary/20">
                <p className="text-lg font-semibold italic whitespace-pre-line break-words bg-gradient-romantic bg-clip-text text-transparent">
                  "{cardData.message}"
                </p>
              </div>
            )}

            {/* YouTube Video */}
            {cardData.url_youtube && getYoutubeEmbedUrl(cardData.url_youtube) && (
              <div className="mb-8">
                <p className="text-center text-lg font-medium mb-4 text-foreground">
                  Bài hát dành cho em 🎵
                </p>
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-romantic max-w-2xl mx-auto">
                  <iframe
                    src={getYoutubeEmbedUrl(cardData.url_youtube)}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 flex-wrap">
              <Button
                variant="romantic"
                size="lg"
                className="shadow-soft"
                onClick={handleShare}
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Đã copy!
                  </>
                ) : (
                  <>
                    <Share2 className="mr-2 h-4 w-4" />
                    Chia sẻ
                  </>
                )}
              </Button>

              {/* <Button
                variant="outline"
                size="lg"
                onClick={handleDownload}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Download className="mr-2 h-4 w-4" />
                Tải xuống
              </Button> */}
            </div>
          </Card>

          {/* Back Button */}

        </div>
      </div>
    </>
  );
};

export default CardDisplay;
