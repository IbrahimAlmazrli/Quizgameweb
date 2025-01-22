var MemoryAnalyzer = {};
(function (MemoryAnalyzer) {
    var FormattingHelpers = (function () {
        function FormattingHelpers() { }
        FormattingHelpers.zeroPad = function zeroPad(stringToPad, newLength, padLeft) {
            for (var i = stringToPad.length; i < newLength; i++) {
                stringToPad = (padLeft ? ("0" + stringToPad) : (stringToPad + "0"));
            }
            return stringToPad;
        };
        FormattingHelpers.forceNonBreakingSpaces = function forceNonBreakingSpaces(stringToConvert) {
            var substitutedString = stringToConvert.replace(/\s/g, function ($0, $1, $2) {
                return "\u00a0";
            });
            return substitutedString;
        };
        FormattingHelpers.forceHtmlRendering = function forceHtmlRendering(stringToConvert) {
            return stringToConvert.replace(/[<>]/g, function ($0, $1, $2) {
                return ($0 === "<") ? "&lt;" : "&gt;";
            });
        };
        FormattingHelpers.trimLongString = function trimLongString(stringToConvert) {
            var substitutedString = stringToConvert;
            var maxStringLength = 38;
            if (stringToConvert.length > maxStringLength) {
                var substrLength = (maxStringLength / 2) - 2;
                substitutedString = stringToConvert.substr(0, substrLength) + "\u2026" + stringToConvert.substr(-(substrLength));
            }
            return substitutedString;
        };
        FormattingHelpers.getNativeDigitLocaleString = function getNativeDigitLocaleString(stringToConvert) {
            var nf = Microsoft.Plugin.Culture.NumberFormat;
            if (!nf) {
                nf = {
                    nativeDigits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
                };
            }
            var substitutedString = stringToConvert.replace(/\d/g, function ($0, $1, $2) {
                return (nf.nativeDigits[parseInt($0)]);
            });
            return substitutedString;
        };
        FormattingHelpers.forceNumberSign = function forceNumberSign(numberToConvert, positive) {
            var nf = Microsoft.Plugin.Culture.NumberFormat;
            if (!nf) {
                nf = {
                    positiveSign: "+",
                    negativeSign: "-",
                };
            }
            if (positive === true) {
                return nf.positiveSign + numberToConvert;
            }
            return nf.negativeSign + numberToConvert;
        };
        FormattingHelpers.getDecimalLocaleString = function getDecimalLocaleString(numberToConvert, includeGroupSeparators, includeSign) {
            var positive = true;
            if (numberToConvert == 0)
                includeSign = false;
            if (numberToConvert < 0) {
                positive = false;
                numberToConvert = numberToConvert * -1;
            }
            var numberString = numberToConvert.toString();
            var nf = Microsoft.Plugin.Culture.NumberFormat;
            if (!nf) {
                nf = {
                    numberDecimalSeparator: ".",
                    numberGroupSizes: [
                        3
                    ],
                    numberGroupSeparator: ",",
                };
            }
            numberString = FormattingHelpers.getNativeDigitLocaleString(numberString);
            var split = numberString.split(/e/i);
            numberString = split[0];
            var exponent = (split.length > 1 ? parseInt(split[1], 10) : 0);
            split = numberString.split('.');
            numberString = split[0];
            var right = split.length > 1 ? split[1] : "";
            if (exponent > 0) {
                right = FormattingHelpers.zeroPad(right, exponent, false);
                numberString += right.slice(0, exponent);
                right = right.substr(exponent);
            }
            else {
                if (exponent < 0) {
                    exponent = -exponent;
                    numberString = FormattingHelpers.zeroPad(numberString, exponent + 1, true);
                    right = numberString.slice(-exponent, numberString.length) + right;
                    numberString = numberString.slice(0, -exponent);
                }
            }
            if (right.length > 0) {
                right = nf.numberDecimalSeparator + right;
            }
            if (includeGroupSeparators === true) {
                var groupSizes = nf.numberGroupSizes;
                var sep = nf.numberGroupSeparator;
                var curSize = groupSizes[0];
                var curGroupIndex = 1;
                var stringIndex = numberString.length - 1;
                var ret = "";
                while (stringIndex >= 0) {
                    if (curSize === 0 || curSize > stringIndex) {
                        if (ret.length > 0) {
                            numberString = numberString.slice(0, stringIndex + 1) + sep + ret + right;
                        }
                        else {
                            numberString = numberString.slice(0, stringIndex + 1) + right;
                        }
                        if (includeSign === true)
                            return FormattingHelpers.forceNumberSign(numberString, positive);
                        return numberString;
                    }
                    if (ret.length > 0) {
                        ret = numberString.slice(stringIndex - curSize + 1, stringIndex + 1) + sep + ret;
                    }
                    else {
                        ret = numberString.slice(stringIndex - curSize + 1, stringIndex + 1);
                    }
                    stringIndex -= curSize;
                    if (curGroupIndex < groupSizes.length) {
                        curSize = groupSizes[curGroupIndex];
                        curGroupIndex++;
                    }
                }
                if (includeSign === true)
                    return FormattingHelpers.forceNumberSign(numberString.slice(0, stringIndex + 1) + sep + ret + right, positive);
                return numberString.slice(0, stringIndex + 1) + sep + ret + right;
            }
            else {
                if (includeSign === true)
                    return FormattingHelpers.forceNumberSign(numberString + right, positive);
                return numberString + right;
            }
        };
        return FormattingHelpers;
    })();
    MemoryAnalyzer.FormattingHelpers = FormattingHelpers;
})(MemoryAnalyzer);

// SIG // Begin signature block
// SIG // MIIkbAYJKoZIhvcNAQcCoIIkXTCCJFkCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // 1WVk4j7Q4OXNyB5K8fn+hjWqTa4BHJduQz7pV6172rOg
// SIG // gg2BMIIF/zCCA+egAwIBAgITMwAAAQNeJRyZH6MeuAAA
// SIG // AAABAzANBgkqhkiG9w0BAQsFADB+MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBT
// SIG // aWduaW5nIFBDQSAyMDExMB4XDTE4MDcxMjIwMDg0OFoX
// SIG // DTE5MDcyNjIwMDg0OFowdDELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjEeMBwGA1UEAxMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA
// SIG // 0ZR2NuaGqzb+aflGfIuIUMuQcH+wVakkHX455wWfD6x7
// SIG // l7LOcwr71JskXBa1Od0bfjNsEfw7JvOYql1Ta6rD7BO4
// SIG // 0u/PV3/MZcuvTS4ysVYrTjQHif5pIb0+RPveEp2Fv3x2
// SIG // hn1ysXabYeaKZExGzrbVOox3k3dnIZy2WgZeR4b1PNEJ
// SIG // yg09zbLpoVB40YSI4gE8IvyvlgjMXZnA7eulWpiS9chA
// SIG // Tmpzr97jdHrTX0aXvOJnKHeZrMEOMRaPAA8B/kteVA/K
// SIG // xGU/CuOjRtv2LAM6Gb5oBRac5n80v6eHjWU5Jslj1O/F
// SIG // 3b0l/v0o9DSGeawq1V8wkTvkFGrrscoEIwIDAQABo4IB
// SIG // fjCCAXowHwYDVR0lBBgwFgYKKwYBBAGCN0wIAQYIKwYB
// SIG // BQUHAwMwHQYDVR0OBBYEFEe+wMvhpj/9ZdY48gNdt693
// SIG // 90D/MFAGA1UdEQRJMEekRTBDMSkwJwYDVQQLEyBNaWNy
// SIG // b3NvZnQgT3BlcmF0aW9ucyBQdWVydG8gUmljbzEWMBQG
// SIG // A1UEBRMNMjMwMDEyKzQzNzk2NTAfBgNVHSMEGDAWgBRI
// SIG // bmTlUAXTgqoXNzcitW2oynUClTBUBgNVHR8ETTBLMEmg
// SIG // R6BFhkNodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtp
// SIG // b3BzL2NybC9NaWNDb2RTaWdQQ0EyMDExXzIwMTEtMDct
// SIG // MDguY3JsMGEGCCsGAQUFBwEBBFUwUzBRBggrBgEFBQcw
// SIG // AoZFaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3BraW9w
// SIG // cy9jZXJ0cy9NaWNDb2RTaWdQQ0EyMDExXzIwMTEtMDct
// SIG // MDguY3J0MAwGA1UdEwEB/wQCMAAwDQYJKoZIhvcNAQEL
// SIG // BQADggIBAJ/1yVMNPw0m7KJE2A3Rn2OWBks/HlzFM6Ok
// SIG // w2yvH8ABuutl7J4zEA+nrFvUvZBhF+cx58MmtKz1J9NI
// SIG // k4aI/hI1kWQi0WstO6gsFZQp0jeW5jX/DM7IBhYWniSx
// SIG // 4jn5bg542AwbtilgJ3Y0JJvduZd1ywE7rYISFiKAiRWE
// SIG // u5hQILAXJoZJr859RRVDNJbPgVwYLNST8mer4nPIPaPN
// SIG // /DIeYBzpsBsw+yy7By6WhJNFKFRczZb9oNuB2LYwykOx
// SIG // 80jAskYcXV52Klif1O7y9PpITLVhi7CMQemquJ2Q9P9q
// SIG // Qg+5PukO7JT8jYC7eOMjp3hbsm0f+VnBfbbROcl54IMc
// SIG // YAraPbDR7Ta/RQfpGzZu5T07BQOn1KclEo/mdqMTs0Va
// SIG // QzGC2tiErrmwH3X19h19URE3J+i1NYRx91eqrvqJccmY
// SIG // 0p5aZHa+jMN9FWqR8RT08tk1Mbjbcvq0dciIm2q/mEXH
// SIG // ZrLX/86SkHXk6+aG0sgb2yfAW5VvSW9YXWkq3lNL+OjK
// SIG // e/ZsFfkDGQ8RhapPmr+qV91gxvVxIPRRqJrK6dHrNEc9
// SIG // dfoi7FU/ahk5axDpWj+O9CN4MLLypjjLNY2qmFkkQLg6
// SIG // Z6QHX6D+2DtJE/sM4e0LbYNQzvB/PuDZCOiMIUpBwt7r
// SIG // jlvuA8Mdbm7mVDVmZ3J8GupS9iLEcj+uMIIHejCCBWKg
// SIG // AwIBAgIKYQ6Q0gAAAAAAAzANBgkqhkiG9w0BAQsFADCB
// SIG // iDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEyMDAGA1UEAxMpTWlj
// SIG // cm9zb2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5
// SIG // IDIwMTEwHhcNMTEwNzA4MjA1OTA5WhcNMjYwNzA4MjEw
// SIG // OTA5WjB+MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
// SIG // aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UE
// SIG // ChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSgwJgYDVQQD
// SIG // Ex9NaWNyb3NvZnQgQ29kZSBTaWduaW5nIFBDQSAyMDEx
// SIG // MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA
// SIG // q/D6chAcLq3YbqqCEE00uvK2WCGfQhsqa+laUKq4Bjga
// SIG // BEm6f8MMHt03a8YS2AvwOMKZBrDIOdUBFDFC04kNeWSH
// SIG // fpRgJGyvnkmc6Whe0t+bU7IKLMOv2akrrnoJr9eWWcpg
// SIG // GgXpZnboMlImEi/nqwhQz7NEt13YxC4Ddato88tt8zpc
// SIG // oRb0RrrgOGSsbmQ1eKagYw8t00CT+OPeBw3VXHmlSSnn
// SIG // Db6gE3e+lD3v++MrWhAfTVYoonpy4BI6t0le2O3tQ5GD
// SIG // 2Xuye4Yb2T6xjF3oiU+EGvKhL1nkkDstrjNYxbc+/jLT
// SIG // swM9sbKvkjh+0p2ALPVOVpEhNSXDOW5kf1O6nA+tGSOE
// SIG // y/S6A4aN91/w0FK/jJSHvMAhdCVfGCi2zCcoOCWYOUo2
// SIG // z3yxkq4cI6epZuxhH2rhKEmdX4jiJV3TIUs+UsS1Vz8k
// SIG // A/DRelsv1SPjcF0PUUZ3s/gA4bysAoJf28AVs70b1FVL
// SIG // 5zmhD+kjSbwYuER8ReTBw3J64HLnJN+/RpnF78IcV9uD
// SIG // jexNSTCnq47f7Fufr/zdsGbiwZeBe+3W7UvnSSmnEyim
// SIG // p31ngOaKYnhfsi+E11ecXL93KCjx7W3DKI8sj0A3T8Hh
// SIG // hUSJxAlMxdSlQy90lfdu+HggWCwTXWCVmj5PM4TasIgX
// SIG // 3p5O9JawvEagbJjS4NaIjAsCAwEAAaOCAe0wggHpMBAG
// SIG // CSsGAQQBgjcVAQQDAgEAMB0GA1UdDgQWBBRIbmTlUAXT
// SIG // gqoXNzcitW2oynUClTAZBgkrBgEEAYI3FAIEDB4KAFMA
// SIG // dQBiAEMAQTALBgNVHQ8EBAMCAYYwDwYDVR0TAQH/BAUw
// SIG // AwEB/zAfBgNVHSMEGDAWgBRyLToCMZBDuRQFTuHqp8cx
// SIG // 0SOJNDBaBgNVHR8EUzBRME+gTaBLhklodHRwOi8vY3Js
// SIG // Lm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9N
// SIG // aWNSb29DZXJBdXQyMDExXzIwMTFfMDNfMjIuY3JsMF4G
// SIG // CCsGAQUFBwEBBFIwUDBOBggrBgEFBQcwAoZCaHR0cDov
// SIG // L3d3dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNS
// SIG // b29DZXJBdXQyMDExXzIwMTFfMDNfMjIuY3J0MIGfBgNV
// SIG // HSAEgZcwgZQwgZEGCSsGAQQBgjcuAzCBgzA/BggrBgEF
// SIG // BQcCARYzaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3Br
// SIG // aW9wcy9kb2NzL3ByaW1hcnljcHMuaHRtMEAGCCsGAQUF
// SIG // BwICMDQeMiAdAEwAZQBnAGEAbABfAHAAbwBsAGkAYwB5
// SIG // AF8AcwB0AGEAdABlAG0AZQBuAHQALiAdMA0GCSqGSIb3
// SIG // DQEBCwUAA4ICAQBn8oalmOBUeRou09h0ZyKbC5YR4WOS
// SIG // mUKWfdJ5DJDBZV8uLD74w3LRbYP+vj/oCso7v0epo/Np
// SIG // 22O/IjWll11lhJB9i0ZQVdgMknzSGksc8zxCi1LQsP1r
// SIG // 4z4HLimb5j0bpdS1HXeUOeLpZMlEPXh6I/MTfaaQdION
// SIG // 9MsmAkYqwooQu6SpBQyb7Wj6aC6VoCo/KmtYSWMfCWlu
// SIG // WpiW5IP0wI/zRive/DvQvTXvbiWu5a8n7dDd8w6vmSiX
// SIG // mE0OPQvyCInWH8MyGOLwxS3OW560STkKxgrCxq2u5bLZ
// SIG // 2xWIUUVYODJxJxp/sfQn+N4sOiBpmLJZiWhub6e3dMNA
// SIG // BQamASooPoI/E01mC8CzTfXhj38cbxV9Rad25UAqZaPD
// SIG // XVJihsMdYzaXht/a8/jyFqGaJ+HNpZfQ7l1jQeNbB5yH
// SIG // PgZ3BtEGsXUfFL5hYbXw3MYbBL7fQccOKO7eZS/sl/ah
// SIG // XJbYANahRr1Z85elCUtIEJmAH9AAKcWxm6U/RXceNcbS
// SIG // oqKfenoi+kiVH6v7RyOA9Z74v2u3S5fi63V4GuzqN5l5
// SIG // GEv/1rMjaHXmr/r8i+sLgOppO6/8MO0ETI7f33VtY5E9
// SIG // 0Z1WTk+/gFcioXgRMiF670EKsT/7qMykXcGhiJtXcVZO
// SIG // SEXAQsmbdlsKgEhr/Xmfwb1tbWrJUnMTDXpQzTGCFkMw
// SIG // ghY/AgEBMIGVMH4xCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xKDAm
// SIG // BgNVBAMTH01pY3Jvc29mdCBDb2RlIFNpZ25pbmcgUENB
// SIG // IDIwMTECEzMAAAEDXiUcmR+jHrgAAAAAAQMwDQYJYIZI
// SIG // AWUDBAIBBQCggcQwGQYJKoZIhvcNAQkDMQwGCisGAQQB
// SIG // gjcCAQQwHAYKKwYBBAGCNwIBCzEOMAwGCisGAQQBgjcC
// SIG // ARUwLwYJKoZIhvcNAQkEMSIEIIfVBwmn4omz5uupXY+B
// SIG // CWl5tfYIfgObVvOvqZo/HwZMMFgGCisGAQQBgjcCAQwx
// SIG // SjBIoCqAKABtAGEAbgBhAGcAZQBkAGgAZQBhAHAAdgBp
// SIG // AGUAdwBlAHIALgBqAHOhGoAYaHR0cDovL3d3dy5taWNy
// SIG // b3NvZnQuY29tMA0GCSqGSIb3DQEBAQUABIIBAK7D8IB+
// SIG // 1hcqxLGRB3gW5JJyWX5shAyhLfYam5sMepcjr0YpzM0w
// SIG // L/4Rrm+pubFDZXH0SzKTz4cDz0ZGaFP0PynqYF9QeqvI
// SIG // F+iTkZ8PaqfFQJVaZv9cfT+w8Ivix1eVVxntdrr9brIv
// SIG // WvSVKUwdfKlSRXknLXYR20AfAyDw4TACO9nBwW1pKO1L
// SIG // 6Pt4T9sGTElrwNTui2AiaQOyRsJd58d+udZG8dQWricu
// SIG // lNaOp1CeI7/R4QVKjh6cR9FdPjAL2Ycy0rgOP3WI45pw
// SIG // /iWdDC1ivbBp4POVF1Uz8GIDSUSHYfE4d7XF9DqNB2tv
// SIG // jPYcSfqgjZILkJn4Z9VCv9DYQHShghO3MIITswYKKwYB
// SIG // BAGCNwMDATGCE6MwghOfBgkqhkiG9w0BBwKgghOQMIIT
// SIG // jAIBAzEPMA0GCWCGSAFlAwQCAQUAMIIBWAYLKoZIhvcN
// SIG // AQkQAQSgggFHBIIBQzCCAT8CAQEGCisGAQQBhFkKAwEw
// SIG // MTANBglghkgBZQMEAgEFAAQgdH4aHiEOJ983J7MPkpml
// SIG // LRGeNCN0xXYaJtzBEAJL7vUCBlx27xwcTxgTMjAxOTAz
// SIG // MTUxOTE4NDMuOTUxWjAHAgEBgAIB9KCB1KSB0TCBzjEL
// SIG // MAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24x
// SIG // EDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jv
// SIG // c29mdCBDb3Jwb3JhdGlvbjEpMCcGA1UECxMgTWljcm9z
// SIG // b2Z0IE9wZXJhdGlvbnMgUHVlcnRvIFJpY28xJjAkBgNV
// SIG // BAsTHVRoYWxlcyBUU1MgRVNOOkY1MjgtMzc3Ny04QTc2
// SIG // MSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBT
// SIG // ZXJ2aWNloIIPHzCCBPUwggPdoAMCAQICEzMAAADRmM/k
// SIG // PJklZIQAAAAAANEwDQYJKoZIhvcNAQELBQAwfDELMAkG
// SIG // A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAO
// SIG // BgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
// SIG // dCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0
// SIG // IFRpbWUtU3RhbXAgUENBIDIwMTAwHhcNMTgwODIzMjAy
// SIG // NjMzWhcNMTkxMTIzMjAyNjMzWjCBzjELMAkGA1UEBhMC
// SIG // VVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcT
// SIG // B1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
// SIG // b3JhdGlvbjEpMCcGA1UECxMgTWljcm9zb2Z0IE9wZXJh
// SIG // dGlvbnMgUHVlcnRvIFJpY28xJjAkBgNVBAsTHVRoYWxl
// SIG // cyBUU1MgRVNOOkY1MjgtMzc3Ny04QTc2MSUwIwYDVQQD
// SIG // ExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNlMIIB
// SIG // IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7wDO
// SIG // xEyGqfaSKQqEPfMK7QKtk1H+sj/kyTnn6kQtbiyktUBL
// SIG // YnmL2kiYX38v6EJYHX5UAGvU7pnskuxwvI1Af2H7jbm4
// SIG // PD+P02K9lx1iFAdLlpdQauWD6EEjTipN1VdUWIvPtCc5
// SIG // 04JBZZPfjG7CIMVJNTek0PfMFNTOC0cbYMe5n0pgIEFA
// SIG // jmH4OmlJOsiXaGs2iLaHTjy3rz6TMLNlvG1wMHkl2+c+
// SIG // SWYlbR6JoFQ0sNAEn6qKxGgR7kpddQlu9wVKHjRLU8cX
// SIG // mEpJIxrZ3Owr7tTs31JcyVrlZg4ayFlIP04qI3NHbiLq
// SIG // A1jEfHaquR7FbqPYz84KPzNykyrH/wIDAQABo4IBGzCC
// SIG // ARcwHQYDVR0OBBYEFIP7EkVwNv9nibpQi93Jxj1U82oM
// SIG // MB8GA1UdIwQYMBaAFNVjOlyKMZDzQ3t8RhvFM2hahW1V
// SIG // MFYGA1UdHwRPME0wS6BJoEeGRWh0dHA6Ly9jcmwubWlj
// SIG // cm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1Rp
// SIG // bVN0YVBDQV8yMDEwLTA3LTAxLmNybDBaBggrBgEFBQcB
// SIG // AQROMEwwSgYIKwYBBQUHMAKGPmh0dHA6Ly93d3cubWlj
// SIG // cm9zb2Z0LmNvbS9wa2kvY2VydHMvTWljVGltU3RhUENB
// SIG // XzIwMTAtMDctMDEuY3J0MAwGA1UdEwEB/wQCMAAwEwYD
// SIG // VR0lBAwwCgYIKwYBBQUHAwgwDQYJKoZIhvcNAQELBQAD
// SIG // ggEBADrgMufapAT0iR6YGdEleg09nyLZRqYv1LLOfaQR
// SIG // HBW4FniWuU2Ndx3MYQXAqmfG3DicdvB3JpTEN/bo27R9
// SIG // wYDT7xgmqKfFblG7yvS4ttuf/kMISGegL94YS1CSBBUL
// SIG // ammK6Vr5STlFJOr8D3TGdPviOciAZC4L22m3MubLcsdg
// SIG // EY5towI/EVpWR5r0EvzunGeTykYUX/Tr00UhkZvk6MwI
// SIG // mCSrLJwcRv4qT4f8lPR+6rJ2SfwJeTyWtX8x6GVr6MRw
// SIG // YtbYNIF0z0SmrzhmfjLDNT2zZGLrcp940BF++Qs1NaIN
// SIG // HA+GiBXs7o7pjXvX7Vs6jhGCBYV18Bf8laWayigwggZx
// SIG // MIIEWaADAgECAgphCYEqAAAAAAACMA0GCSqGSIb3DQEB
// SIG // CwUAMIGIMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
// SIG // aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UE
// SIG // ChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMTIwMAYDVQQD
// SIG // EylNaWNyb3NvZnQgUm9vdCBDZXJ0aWZpY2F0ZSBBdXRo
// SIG // b3JpdHkgMjAxMDAeFw0xMDA3MDEyMTM2NTVaFw0yNTA3
// SIG // MDEyMTQ2NTVaMHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAk
// SIG // BgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAy
// SIG // MDEwMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKC
// SIG // AQEAqR0NvHcRijog7PwTl/X6f2mUa3RUENWlCgCChfvt
// SIG // fGhLLF/Fw+Vhwna3PmYrW/AVUycEMR9BGxqVHc4JE458
// SIG // YTBZsTBED/FgiIRUQwzXTbg4CLNC3ZOs1nMwVyaCo0UN
// SIG // 0Or1R4HNvyRgMlhgRvJYR4YyhB50YWeRX4FUsc+TTJLB
// SIG // xKZd0WETbijGGvmGgLvfYfxGwScdJGcSchohiq9LZIlQ
// SIG // YrFd/XcfPfBXday9ikJNQFHRD5wGPmd/9WbAA5ZEfu/Q
// SIG // S/1u5ZrKsajyeioKMfDaTgaRtogINeh4HLDpmc085y9E
// SIG // uqf03GS9pAHBIAmTeM38vMDJRF1eFpwBBU8iTQIDAQAB
// SIG // o4IB5jCCAeIwEAYJKwYBBAGCNxUBBAMCAQAwHQYDVR0O
// SIG // BBYEFNVjOlyKMZDzQ3t8RhvFM2hahW1VMBkGCSsGAQQB
// SIG // gjcUAgQMHgoAUwB1AGIAQwBBMAsGA1UdDwQEAwIBhjAP
// SIG // BgNVHRMBAf8EBTADAQH/MB8GA1UdIwQYMBaAFNX2VsuP
// SIG // 6KJcYmjRPZSQW9fOmhjEMFYGA1UdHwRPME0wS6BJoEeG
// SIG // RWh0dHA6Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kvY3Js
// SIG // L3Byb2R1Y3RzL01pY1Jvb0NlckF1dF8yMDEwLTA2LTIz
// SIG // LmNybDBaBggrBgEFBQcBAQROMEwwSgYIKwYBBQUHMAKG
// SIG // Pmh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kvY2Vy
// SIG // dHMvTWljUm9vQ2VyQXV0XzIwMTAtMDYtMjMuY3J0MIGg
// SIG // BgNVHSABAf8EgZUwgZIwgY8GCSsGAQQBgjcuAzCBgTA9
// SIG // BggrBgEFBQcCARYxaHR0cDovL3d3dy5taWNyb3NvZnQu
// SIG // Y29tL1BLSS9kb2NzL0NQUy9kZWZhdWx0Lmh0bTBABggr
// SIG // BgEFBQcCAjA0HjIgHQBMAGUAZwBhAGwAXwBQAG8AbABp
// SIG // AGMAeQBfAFMAdABhAHQAZQBtAGUAbgB0AC4gHTANBgkq
// SIG // hkiG9w0BAQsFAAOCAgEAB+aIUQ3ixuCYP4FxAz2do6Eh
// SIG // b7Prpsz1Mb7PBeKp/vpXbRkws8LFZslq3/Xn8Hi9x6ie
// SIG // JeP5vO1rVFcIK1GCRBL7uVOMzPRgEop2zEBAQZvcXBf/
// SIG // XPleFzWYJFZLdO9CEMivv3/Gf/I3fVo/HPKZeUqRUgCv
// SIG // OA8X9S95gWXZqbVr5MfO9sp6AG9LMEQkIjzP7QOllo9Z
// SIG // Kby2/QThcJ8ySif9Va8v/rbljjO7Yl+a21dA6fHOmWaQ
// SIG // jP9qYn/dxUoLkSbiOewZSnFjnXshbcOco6I8+n99lmqQ
// SIG // eKZt0uGc+R38ONiU9MalCpaGpL2eGq4EQoO4tYCbIjgg
// SIG // tSXlZOz39L9+Y1klD3ouOVd2onGqBooPiRa6YacRy5rY
// SIG // DkeagMXQzafQ732D8OE7cQnfXXSYIghh2rBQHm+98eEA
// SIG // 3+cxB6STOvdlR3jo+KhIq/fecn5ha293qYHLpwmsObvs
// SIG // xsvYgrRyzR30uIUBHoD7G4kqVDmyW9rIDVWZeodzOwjm
// SIG // mC3qjeAzLhIp9cAvVCch98isTtoouLGp25ayp0Kiyc8Z
// SIG // QU3ghvkqmqMRZjDTu3QyS99je/WZii8bxyGvWbWu3EQ8
// SIG // l1Bx16HSxVXjad5XwdHeMMD9zOZN+w2/XU/pnR4ZOC+8
// SIG // z1gFLu8NoFA12u8JJxzVs341Hgi62jbb01+P3nSISRKh
// SIG // ggOtMIIClQIBATCB/qGB1KSB0TCBzjELMAkGA1UEBhMC
// SIG // VVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcT
// SIG // B1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
// SIG // b3JhdGlvbjEpMCcGA1UECxMgTWljcm9zb2Z0IE9wZXJh
// SIG // dGlvbnMgUHVlcnRvIFJpY28xJjAkBgNVBAsTHVRoYWxl
// SIG // cyBUU1MgRVNOOkY1MjgtMzc3Ny04QTc2MSUwIwYDVQQD
// SIG // ExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNloiUK
// SIG // AQEwCQYFKw4DAhoFAAMVAEpczNJOr+lrEQJ6hpddUbl2
// SIG // tlTxoIHeMIHbpIHYMIHVMQswCQYDVQQGEwJVUzETMBEG
// SIG // A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSkwJwYDVQQLEyBNaWNyb3NvZnQgT3BlcmF0aW9ucyBQ
// SIG // dWVydG8gUmljbzEnMCUGA1UECxMebkNpcGhlciBOVFMg
// SIG // RVNOOjRERTktMEM1RS0zRTA5MSswKQYDVQQDEyJNaWNy
// SIG // b3NvZnQgVGltZSBTb3VyY2UgTWFzdGVyIENsb2NrMA0G
// SIG // CSqGSIb3DQEBBQUAAgUA4DWZqjAiGA8yMDE5MDMxNTEx
// SIG // MjUzMFoYDzIwMTkwMzE2MTEyNTMwWjB0MDoGCisGAQQB
// SIG // hFkKBAExLDAqMAoCBQDgNZmqAgEAMAcCAQACAgqyMAcC
// SIG // AQACAhqsMAoCBQDgNusqAgEAMDYGCisGAQQBhFkKBAIx
// SIG // KDAmMAwGCisGAQQBhFkKAwGgCjAIAgEAAgMW42ChCjAI
// SIG // AgEAAgMHoSAwDQYJKoZIhvcNAQEFBQADggEBACERgI15
// SIG // pGw20+rHl76PrtEd3nvYcx+TDp2Phw3/VP3RNnxXI/md
// SIG // 5qGKKEt02798AxKR8fMEJpdDFmjDS/7lRB3nZKTGI/By
// SIG // oAWZNGJ6BaNVPewrGUbTrIkPMlk4nqJsvRA/orYpk2WL
// SIG // 3j0DZUKqq1fcmJpC/AnVIxS0MjERHrs3QMA+V/EbOpE5
// SIG // MZ/v6dDoZ1XHfDM7oMTa5Edm7+anuGO8CcMGnLgbaUhS
// SIG // EYDt99nrf6JD7RQvfeDGSI3iyP7cxc2M9ohDU+RcNxDt
// SIG // Du2wSXsHYkLwwbfbUs/zyjcY/CvCiVFCzfSUKRUKwBk3
// SIG // 2jaWbOcQ+qkTjpZ6VLyx2ytvFxsxggL1MIIC8QIBATCB
// SIG // kzB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGlu
// SIG // Z3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMV
// SIG // TWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1N
// SIG // aWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMAITMwAA
// SIG // ANGYz+Q8mSVkhAAAAAAA0TANBglghkgBZQMEAgEFAKCC
// SIG // ATIwGgYJKoZIhvcNAQkDMQ0GCyqGSIb3DQEJEAEEMC8G
// SIG // CSqGSIb3DQEJBDEiBCCJ79TsbdPHa8b/ovS7C8MVprDy
// SIG // GvcYIvJqJMVM/Y9odjCB4gYLKoZIhvcNAQkQAgwxgdIw
// SIG // gc8wgcwwgbEEFEpczNJOr+lrEQJ6hpddUbl2tlTxMIGY
// SIG // MIGApH4wfDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldh
// SIG // c2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNV
// SIG // BAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UE
// SIG // AxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAC
// SIG // EzMAAADRmM/kPJklZIQAAAAAANEwFgQUm/qs05w+Ageb
// SIG // 5YTn0sCtMxAI95MwDQYJKoZIhvcNAQELBQAEggEABa2v
// SIG // sECzSLcAXLyR8IxfjULwLlPkmo87Timv/RBzXXXAmgrP
// SIG // UC+N4B5ZZSTG6F9/Nnh5MVOxgMkeosrDovQyLKG098CM
// SIG // JODCK0b3+MzajPcX/HgPcGtosJRq10GKkIqay/pShuOE
// SIG // BrtJTYLTsQ8n8SC54x/lb35AwcJeSWGavMME/bp3fIiK
// SIG // ULzvWoUiKgaJcakgpitRH0TOwypGOd4qPvMa6UGwsOID
// SIG // aOlc+gyV8wSeSdD9IeUG9qcg7kVZAUx4DNBfhK8cmfLg
// SIG // pdPi9Qv4FdweK6t6vDrwoPGTXhynvzzsAaLCCs1PjagQ
// SIG // zKKdQDCmgeZNem209k+CXki6OfucqQ==
// SIG // End signature block
