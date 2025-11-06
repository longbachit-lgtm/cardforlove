import { useState, useEffect } from "react";
import { Heart, Calendar, Upload, Youtube, Loader2, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { format, differenceInDays } from "date-fns";
import { vi } from "date-fns/locale";
import { cn, fixImageOrientation } from "@/lib/utils";
import valentineBg from "@/assets/valentine-bg.jpg";
import { uploadImage, createCard, type CardLoveData } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const MESSAGE_COLORS = [
  {
    name: "Mặc định",
    value: "gradient-romantic",
    labelClass: "bg-gradient-romantic bg-clip-text text-transparent border-primary"
  },
  {
    name: "Hồng",
    value: "#e75480",
    labelClass: "text-[#e75480] border-[#e75480]"
  },
  {
    name: "Đỏ",
    value: "#e53935",
    labelClass: "text-[#e53935] border-[#e53935]"
  },
  {
    name: "Tím",
    value: "#a259cb",
    labelClass: "text-[#a259cb] border-[#a259cb]"
  },
  {
    name: "Xanh Dương",
    value: "#2196f3",
    labelClass: "text-[#2196f3] border-[#2196f3]"
  },
];

const Index = () => {
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [daysInLove, setDaysInLove] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadedImage1, setUploadedImage1] = useState<string | null>(null);
  const [uploadedImage2, setUploadedImage2] = useState<string | null>(null);
  const [message, setMessage] = useState<string>(""); // Thông điệp tình yêu
  const [messageColor, setMessageColor] = useState<string>("gradient-romantic");
  // Add state for controlled date input
  const [dateInputValue, setDateInputValue] = useState<string>("");
  // Add state for person names
  const [personOne, setPersonOne] = useState<string>("");
  const [personTwo, setPersonTwo] = useState<string>("");

  const { toast } = useToast();
  const navigate = useNavigate();

  // Sync input field value <=> startDate
  useEffect(() => {
    if (startDate) {
      const d = startDate.getDate().toString().padStart(2, "0");
      const m = (startDate.getMonth() + 1).toString().padStart(2, "0");
      const y = startDate.getFullYear();
      setDateInputValue(`${d}/${m}/${y}`);
      const days = differenceInDays(new Date(), startDate);
      setDaysInLove(days >= 0 ? days : 0);
    }
  }, [startDate]);

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^\d]/g, ""); // chỉ lấy số

    // Thêm dấu "/" tự động khi nhập đủ số
    if (val.length > 2 && val.length <= 4) {
      val = `${val.slice(0,2)}/${val.slice(2,4)}`;
    } else if (val.length > 4) {
      val = `${val.slice(0,2)}/${val.slice(2,4)}/${val.slice(4,8)}`;
    }

    setDateInputValue(val);

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(val)) {
      const [d, m, y] = val.split("/");
      const parsedDate = new Date(Number(y), Number(m) - 1, Number(d));
      if (!isNaN(parsedDate.getTime())) {
        setStartDate(parsedDate);
        return;
      }
    }
    // Chỉ clear startDate nếu trường rỗng hoặc không hợp lệ format
    setStartDate(undefined);
  };

  const handleCalendarSelect = (date?: Date) => {
    if (!!date) {
      setStartDate(date);
      // The useEffect above will sync setDateInputValue for us
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: (img: string) => void,
    setUploadedImage: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Xử lý EXIF orientation để xoay ảnh đúng hướng
    setUploading(true);
    try {
      const { dataURL, file: fixedFile } = await fixImageOrientation(file);
      
      // Hiển thị ảnh đã được xoay đúng
      setImage(dataURL);

      // Upload ảnh đã được xoay đúng lên server
      const uploadedUrl = await uploadImage(fixedFile);
      setUploadedImage(uploadedUrl);
      toast({
        title: "Tải ảnh thành công!",
        // description: "Ảnh đã được tải lên server.",
      });
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: "Lỗi tải ảnh",
        description: "Không thể tải ảnh lên server. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getYoutubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  };

  const handleSaveCard = async () => {
    if (!uploadedImage1 || !uploadedImage2) {
      toast({
        title: "Thiếu ảnh",
        description: "Vui lòng tải lên ảnh của cả hai người.",
        variant: "destructive",
      });
      return;
    }

    if (!startDate) {
      toast({
        title: "Thiếu ngày",
        description: "Vui lòng chọn ngày bắt đầu yêu.",
        variant: "destructive",
      });
      return;
    }

    if (!personOne.trim()) {
      toast({
        title: "Thiếu tên",
        description: "Vui lòng nhập tên của người thứ nhất.",
        variant: "destructive",
      });
      return;
    }

    if (!personTwo.trim()) {
      toast({
        title: "Thiếu tên",
        description: "Vui lòng nhập tên của người thứ hai.",
        variant: "destructive",
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Thiếu thông điệp",
        description: "Vui lòng điền thông điệp tình yêu.",
        variant: "destructive",
      });
      return;
    }
    // if (!youtubeUrl.trim()) {
    //   toast({
    //     title: "Thiếu link YouTube",
    //     description: "Vui lòng điền link YouTube.",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    setSaving(true);
    try {
      const cardData: CardLoveData = {
        person_one: personOne || "Em",
        img_person_one: uploadedImage1,
        person_two: personTwo || "Anh",
        img_person_two: uploadedImage2,
        start_date: format(startDate, "yyyy-MM-dd"),
        ...(youtubeUrl.trim() && { url_youtube: youtubeUrl }),
        message: message, // Truyền thông điệp người dùng nhập từ field bên dưới
      };

      const result = await createCard(cardData);

      toast({
        title: "Lưu thiệp thành công! 💝",
        description: "Thiệp Valentine đã được lưu vào hệ thống.",
      });

      // Chuyển đến trang hiển thị card
      navigate(`/card/${result.data._id}`);
    } catch (error) {
      console.error("Save card failed:", error);
      toast({
        title: "Lỗi lưu thiệp",
        description: "Không thể lưu thiệp. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Điều kiện để hiển thị Preview Card
  const shouldShowCard =
    !!image1 ||
    !!image2 ||
    !!startDate ||
    !!youtubeUrl ||
    !!message ||
    !!personOne.trim() ||
    !!personTwo.trim();

  return (
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

      <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-romantic bg-clip-text text-transparent">
            Thiệp Valentine
          </h1>
          <p className="text-lg text-muted-foreground">
            Gửi tình yêu đến người thương 💕
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Image Upload Section */}
          <Card className="p-6 gradient-card shadow-romantic backdrop-blur-sm border-primary/20 animate-in fade-in slide-in-from-left duration-700">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-foreground">
              <Heart className="w-6 h-6 text-primary" />
              Thông tin hai người
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {/* Image 1 */}
              <div className="space-y-3 flex flex-col">
                <label className="block text-sm font-medium text-foreground">
                  Ảnh của em
                </label>
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted/50 border-2 border-dashed border-primary/30 hover:border-primary/60 transition-smooth group">
                  {image1 ? (
                    <img
                      src={image1}
                      alt="Person 1"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary transition-smooth">
                      {uploading ? (
                        <>
                          <Loader2 className="w-8 h-8 mb-2 animate-spin" />
                          <span className="text-sm">Đang tải...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mb-2" />
                          <span className="text-sm">Tải ảnh lên</span>
                        </>
                      )}
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload(e, setImage1, setUploadedImage1)
                    }
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder="Nhập tên em"
                    value={personOne}
                    onChange={(e) => setPersonOne(e.target.value)}
                    className="border-primary/30 focus:border-primary transition-smooth mt-2"
                    required
                  />
                </div>
              </div>


              {/* Image 2 */}
              <div className="space-y-3 flex flex-col">
                <label className="block text-sm font-medium text-foreground">
                  Ảnh của anh
                </label>
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted/50 border-2 border-dashed border-primary/30 hover:border-primary/60 transition-smooth group">
                  {image2 ? (
                    <img
                      src={image2}
                      alt="Person 2"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary transition-smooth">
                      {uploading ? (
                        <>
                          <Loader2 className="w-8 h-8 mb-2 animate-spin" />
                          <span className="text-sm">Đang tải...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mb-2" />
                          <span className="text-sm">Tải ảnh lên</span>
                        </>
                      )}
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload(e, setImage2, setUploadedImage2)
                    }
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder="Nhập tên anh"
                    value={personTwo}
                    onChange={(e) => setPersonTwo(e.target.value)}
                    className="border-primary/30 focus:border-primary transition-smooth mt-2"
                    required
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Date & YouTube Section */}
          <Card className="p-6 gradient-card shadow-romantic backdrop-blur-sm border-primary/20 animate-in fade-in slide-in-from-right duration-700">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-foreground">
              <Calendar className="w-6 h-6 text-primary" />
              Thông tin tình yêu
            </h2>

            {/* Date Picker */}
            <div className="space-y-3 mb-6">
              <label className="block text-sm font-medium text-foreground">
                Ngày bắt đầu yêu
              </label>
              <div className="flex gap-2 items-center">
                {/* Date input */}
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="\d{2}/\d{2}/\d{4}"
                  placeholder="dd/mm/yyyy"
                  value={dateInputValue}
                  onChange={handleDateInputChange}
                  maxLength={10}
                  className="flex-1 border-primary/30 focus:border-primary transition-smooth"
                  autoComplete="off"
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "px-3 py-2 min-w-[44px] h-[44px] flex items-center justify-center hover:border-primary transition-smooth",
                        !startDate && "text-muted-foreground"
                      )}
                      tabIndex={-1}
                      type="button"
                    >
                      <Calendar className="w-5 h-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={handleCalendarSelect}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Bạn có thể nhập tay <span className="font-semibold">dd/mm/yyyy</span> hoặc chọn từ lịch
              </p>
            </div>

            {/* Days Counter */}
            {startDate && (
              <div className="mb-6 p-6 rounded-lg bg-gradient-romantic text-center shadow-soft animate-in fade-in duration-500">
                <p className="text-sm text-primary-foreground/80 mb-2">
                  Chúng ta đã yêu nhau
                </p>
                <p className="text-5xl font-bold text-primary-foreground mb-2">
                  {daysInLove}
                </p>
                <p className="text-lg text-primary-foreground/90">ngày</p>
              </div>
            )}

            {/* YouTube URL */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">
                Link YouTube
              </label>
              <div className="flex gap-2">
                <Youtube className="w-5 h-5 text-primary mt-2.5" />
                <Input
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="flex-1 border-primary/30 focus:border-primary transition-smooth"
                />
              </div>
            </div>

            {/* Message - Love Message input & color picker */}
            <div className="space-y-3 mt-6">
              <label className="block text-sm font-medium text-foreground flex items-center gap-2">
                Thông điệp tình yêu <span className="text-red-500">*</span>
                <Palette className="w-4 h-4 text-pink-500" />
                <span className="text-muted-foreground text-xs">(chọn màu chữ bên dưới)</span>
              </label>
              <textarea
                value={message}
                minLength={1}
                maxLength={500}
                placeholder="Viết lời nhắn, lời chúc, hoặc cảm xúc của bạn đến người thương..."
                onChange={(e) => setMessage(e.target.value)}
                className="w-full min-h-[80px] border border-primary/30 focus:border-primary transition-smooth px-3 py-2 resize-none rounded-md"
                required
                style={
                  messageColor.startsWith("gradient")
                    ? {
                      background:
                        "linear-gradient(90deg, #ff99cc 0%, #fc6076 68%, #ff9966 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: "bold",
                    }
                    : {
                      fontWeight: "bold",
                      color: messageColor,
                    }
                }
              />
              <div className="flex items-center gap-2 flex-wrap mt-1">
                {MESSAGE_COLORS.map((c) => (
                  <button
                    type="button"
                    key={c.value}
                    aria-label={c.name}
                    className={cn(
                      "px-3 py-1 rounded-full border flex items-center text-sm cursor-pointer transition-smooth",
                      c.labelClass,
                      messageColor === c.value
                        ? "ring-2 ring-offset-2 ring-primary font-semibold"
                        : "opacity-90 hover:shadow"
                    )}
                    style={
                      c.value.startsWith("#")
                        ? { color: c.value, borderColor: c.value }
                        : {}
                    }
                    onClick={() => setMessageColor(c.value)}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
              <div className="text-xs text-muted-foreground text-right">{message.length}/500</div>
            </div>
          </Card>
        </div>

        {/* Preview Card */}
        {shouldShowCard && (
          <Card className="p-8 gradient-card shadow-romantic backdrop-blur-sm border-primary/20 animate-in fade-in slide-in-from-bottom duration-700">
            <h2 className="text-3xl font-semibold mt-12 mb-6 text-center bg-gradient-romantic bg-clip-text text-transparent">
              Thiệp của chúng ta 💝
            </h2>

            <div className="space-y-6 mt-12">
        
              {/* Images Preview */}
              {(image1 || image2 || personOne.trim() || personTwo.trim()) && (
                <div
                  className="flex justify-center items-end gap-6 flex-wrap custom-preview-row"
                >
                  {/* Person 1 */}
                  {(image1 || personOne.trim()) && (
                    <div className="flex flex-col items-center group">
                      <div className="relative group">
                        {image1 ? (
                          <>
                            <div className="absolute -inset-1 bg-gradient-romantic rounded-full blur opacity-50 group-hover:opacity-75 transition-smooth"></div>
                            <img
                              src={image1}
                              alt="Person 1"
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
                        {personOne.trim() ? personOne : "Em"} 
                      </div>
                    </div>
                  )}

                  {((image1 || personOne.trim()) && (image2 || personTwo.trim())) && (
                    <Heart className="w-10 h-10 text-primary animate-pulse" />
                  )}

                  {/* Person 2 */}
                  {(image2 || personTwo.trim()) && (
                    <div className="flex flex-col items-center group">
                      <div className="relative group">
                        {image2 ? (
                          <>
                            <div className="absolute -inset-1 bg-gradient-romantic rounded-full blur opacity-50 group-hover:opacity-75 transition-smooth"></div>
                            <img
                              src={image2}
                              alt="Person 2"
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
                        {personTwo.trim() ? personTwo : "Anh"}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* Inline style for custom responsive: 
                  - display: flex with row layout (default)
                  - for width < 443px: change flex-direction to column, align center
              */}
              <style>
                {`
                  @media (max-width: 443px) {
                    .custom-preview-row {
                      flex-direction: column !important;
                      align-items: center !important;
                      gap: 1.5rem !important;
                    }
                    .custom-preview-row .animate-pulse {
                      margin: 1.25rem 0 !important;
                    }
                  }
                `}
              </style>

              {/* Days Counter Preview */}
              {startDate && (
                <div className="text-center py-2">
                  <div className="text-2xl font-semibold text-foreground mb-1">
                    Chúng ta đã yêu nhau
                  </div>
                  <div className="text-4xl font-bold text-primary mt-1 mb-1">
                    {daysInLove} ngày
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Kể từ ngày <span className="font-medium">{format(startDate, "dd/MM/yyyy", { locale: vi })}</span>
                  </div>
                </div>
              )}

              {/* Love message preview */}
              {message && (
                <div className="p-1 max-w-2xl mx-auto text-center animate-in fade-in duration-700">
                  <div
                    className={cn(
                      "text-lg font-semibold italic whitespace-pre-line break-words",
                      messageColor === "gradient-romantic" ? "bg-gradient-romantic bg-clip-text text-transparent" : ""
                    )}
                    style={
                      messageColor === "gradient-romantic"
                        ? {
                            textShadow:
                              "0 1px 6px hsl(340, 82%, 80%, 0.14), 0 1px 0 hsl(280, 70%, 60%,0.13)",
                          }
                        : {
                            color: messageColor,
                            textShadow:
                              "0 1.5px 4px rgba(0,0,0,0.06),0 1px 0 rgba(0,0,0,0.02)",
                          }
                    }
                  >
                    {message}
                  </div>
                </div>
              )}

              {/* YouTube Preview */}
              {youtubeUrl && getYoutubeEmbedUrl(youtubeUrl) && (
                <div className="max-w-2xl mx-auto">
                  <div className="text-center text-lg font-medium mb-4 text-foreground">
                    Bài hát dành cho em <span role="img" aria-label="music">🎵</span>
                  </div>
                  <div className="relative aspect-video rounded-lg overflow-hidden shadow-romantic">
                    <iframe
                      src={getYoutubeEmbedUrl(youtubeUrl)}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-center gap-4">
              <Button
                variant="romantic"
                size="lg"
                className="shadow-soft"
                onClick={handleSaveCard}
                disabled={
                  saving ||
                  uploading 
                  // ||
                  // !uploadedImage1 ||
                  // !uploadedImage2 ||
                  // !startDate ||
                  // !personOne.trim() ||
                  // !personTwo.trim() ||
                  // !message.trim() ||
                  // !youtubeUrl.trim()
                }
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Heart className="mr-2" />
                    Lưu thiệp
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
