'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Button } from './ui/button';
import { Download, Eye } from 'lucide-react';

export function QRCodeGenerator({ value, size = 150, className = '', showDownloadButton = false, onViewLarge = null }) {
    const canvasRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!value || !canvasRef.current) return;

        const generateQR = async () => {
            try {
                setIsLoading(true);
                setError(null);

                await QRCode.toCanvas(canvasRef.current, value, {
                    width: size,
                    margin: 2,
                    color: {
                        dark: '#000000',  
                        light: '#FFFFFF'  
                    }
                });

                setIsLoading(false);
            } catch (err) {
                console.error('Error generating QR code:', err);
                setError('Failed to generate QR code');
                setIsLoading(false);
            }
        };

        generateQR();
    }, [value, size]);

    const downloadQRCode = (downloadSize = size) => {
        if (!value) return;

        const tempCanvas = document.createElement('canvas');

        QRCode.toCanvas(tempCanvas, value, {
            width: downloadSize,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        }).then(() => {
            const link = document.createElement('a');
            link.download = `qr-code-${value.substring(0, 15)}-${downloadSize}px.png`;
            link.href = tempCanvas.toDataURL();
            link.click();
        });
    };

    if (!value) {
        return (
            <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
                style={{ width: size, height: size }}>
                <span className="text-gray-500 text-sm">No QR Code</span>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            <div
                className="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {isLoading && (
                    <div className="flex items-center justify-center bg-gray-100 "
                        style={{ width: size, height: size }}>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    </div>
                )}

                {error && (
                    <div className="flex items-center justify-center bg-red-100 rounded-lg text-red-600 text-sm"
                        style={{ width: size, height: size }}>
                        {error}
                    </div>
                )}

                <canvas
                    ref={canvasRef}
                    className={`rounded-lg border border-gray-200 ${isLoading || error ? 'hidden' : 'block'}`}
                />

                {onViewLarge && isHovered && !isLoading && !error && (
                    <div
                        className="absolute top-0 left-0 flex items-center justify-center z-10 rounded-lg cursor-pointer transition-opacity duration-200"
                        style={{
                            width: size,
                            height: size,
                            backgroundColor: 'rgb(0 0 0 / 55%)'
                        }}
                        onClick={onViewLarge}
                    >
                        <Eye className="h-8 w-8 text-white" />
                    </div>
                )}
            </div>

            {showDownloadButton && !isLoading && !error && (
                <div className="flex justify-center mt-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadQRCode()}
                        className="text-xs h-7"
                    >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                    </Button>
                </div>
            )}
        </div>
    );
}

export function QRCodeDisplay({ qrCodeValue, title, className = '', onViewLarge = null }) {
    return (
        <div className={`p-0 ${className}`}>
            <div className="text-center">
                <QRCodeGenerator
                    value={qrCodeValue}
                    size={120}
                    onViewLarge={onViewLarge}
                />
            </div>
        </div>
    );
}

export function QRCodeModal({ qrCodeValue, title, onClose, hoarding }) {
    const [selectedSize, setSelectedSize] = useState(300);

    const downloadSizes = [
        { label: 'Small (150px)', value: 150 },
        { label: 'Medium (300px)', value: 300 },
        { label: 'Large (500px)', value: 500 },
        { label: 'Extra Large (800px)', value: 800 }
    ];

    const downloadQRCode = (downloadSize) => {
        if (!qrCodeValue) return;

        const tempCanvas = document.createElement('canvas');

        QRCode.toCanvas(tempCanvas, qrCodeValue, {
            width: downloadSize,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        }).then(() => {
            const link = document.createElement('a');
            link.download = `qr-code-${qrCodeValue.substring(0, 15)}-${downloadSize}px.png`;
            link.href = tempCanvas.toDataURL();
            link.click();
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{
                backgroundColor: 'rgb(0 0 0 / 55%)'
            }}
        >
            <div className="bg-white max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{title || "QR Code Details"}</h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </Button>
                </div>

                <div className="text-center">
                    <div className='flex justify-center'>
                        <QRCodeGenerator
                            value={qrCodeValue}
                            size={selectedSize}
                            className="mx-auto mb-4"
                        />

                    </div>

                    {hoarding && (
                        <div className="text-left bg-gray-50 p-3 rounded-lg mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Hoarding Details:</h4>
                            <p className="text-sm text-gray-600 mb-1">
                                <strong>Address:</strong> {hoarding.address}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                                <strong>Size:</strong> {hoarding.height} x {hoarding.width} feet
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Owner:</strong> {hoarding.owner.name}
                            </p>
                        </div>
                    )}

                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                        <h4 className="font-medium text-gray-900 mb-3">Download Options</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {downloadSizes.map((sizeOption) => (
                                <Button
                                    key={sizeOption.value}
                                    size="sm"
                                    variant="outline"
                                    onClick={() => downloadQRCode(sizeOption.value)}
                                    className="text-xs h-8"
                                >
                                    <Download className="h-3 w-3 mr-1" />
                                    {sizeOption.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={onClose}
                            variant="outline"
                            className="flex-1"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}