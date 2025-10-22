import { useMemo, useRef, useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import {
    differenceInCalendarDays,
    format,
    parse,
    isAfter,
    startOfDay,
} from "date-fns";

const PARSE_FORMATS = ["dd-MM-yyyy", "dd/MM/yyyy", "yyyy-MM-dd"];

export default function LoveDaysPicker({ onDateChange, initialDate = null }) {
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [error, setError] = useState("");
    const fpRef = useRef(null); // instance flatpickr

    const daysLoved = useMemo(() => {
        if (!selectedDate) return 0;
        const today = startOfDay(new Date());
        return Math.max(0, differenceInCalendarDays(today, startOfDay(selectedDate)));
    }, [selectedDate]);

    const validateAndSet = (d) => {
        if (!d || isNaN(d)) {
            setError("Ngày không hợp lệ. Định dạng: dd-MM-yyyy");
            return;
        }
        const today = startOfDay(new Date());
        const day = startOfDay(d);
        if (isAfter(day, today)) {
            setError("Không được chọn ngày trong tương lai.");
            return;
        }
        setError("");
        setSelectedDate(day);
        // Gọi callback với ngày đã format
        onDateChange?.(format(day, 'dd-MM-yyyy'));
    };

    const openCalendar = () => {
        fpRef.current?.open();
        // focus ô nhập để user có thể gõ ngay
        fpRef.current?.altInput?.focus();
    };

    const clearDate = () => {
        setSelectedDate(null);
        setError("");
        // clear luôn altInput nếu có
        if (fpRef.current?.altInput) fpRef.current.altInput.value = "";
    };

    return (
        <div className="picker-wrap">
            {/* Nút mở lịch / cũng là CTA rõ ràng */}
            <h5 className="h4">Nhập ngày yêu</h5>

            {/* Ô nhập + lịch: cho phép gõ tay & chọn lịch */}
            <Flatpickr
                value={selectedDate}
                options={{
                    maxDate: "today",
                    dateFormat: "Y-m-d",         // format nội bộ
                    altInput: true,              // hiển thị input đẹp cho người dùng
                    altFormat: "d-m-Y",          // người dùng thấy dd-MM-yyyy
                    altInputClass: "picker-input",
                    allowInput: true,            // CHO PHÉP GÕ TAY
                    disableMobile: true,
                    appendTo: typeof window !== "undefined" ? document.body : undefined,
                    position: "auto center",
                }}
                onReady={(_, __, instance) => (fpRef.current = instance)}
                onChange={(dates) => {
                    const d = dates?.[0];
                    if (d) validateAndSet(d);
                }}
                onClose={(dates, _str, inst) => {
                    // Nếu user gõ tay và không bấm chọn trên lịch
                    if (!dates?.length) {
                        const raw = inst?.altInput?.value?.trim();
                        if (!raw) return;
                        let parsed;
                        for (const fmt of PARSE_FORMATS) {
                            const p = parse(raw, fmt, new Date());
                            if (!isNaN(p)) { parsed = p; break; }
                        }
                        validateAndSet(parsed);
                    }
                }}
                placeholder="Nhập ngày yêu 💖"
            />

            {selectedDate && (
                <button type="button" className="picker-clear" onClick={clearDate}>
                    Xóa
                </button>
            )}

            <div className={`picker-hint ${error ? "err" : ""}`}>
                {error || "Bạn có thể chọn lịch hoặc gõ: dd-MM-yyyy"}
            </div>

            {/* Days counter */}
            <div className="days-counter">
                <div className="days-number">{daysLoved}</div>
                <div className="days-label">Days</div>
            </div>
        </div>
    );
}
