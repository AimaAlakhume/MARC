import './ItemLocator.scss';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import crashCartImage from '../../assets/images-v1/crash-cart.png';
import Switch from '@mui/material/Switch';
import RefreshIcon from '../../assets/icons/refresh-icon.png';
import closeIcon from '../../assets/icons/close-icon.png';
import { VolumeUp as VolumeUpIcon, VolumeOff as VolumeOffIcon } from "@mui/icons-material";

export const ItemLocator = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchSubmitted, setSearchSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [drawerImageSrc, setDrawerImageSrc] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [audioMuted, setAudioMuted] = useState(false);
    const audioRef = React.useRef(null);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/data');

                if (response.data && response.data.inventory) {
                    setInventory(response.data.inventory);
                } else {
                    console.error("Invalid inventory data format:", response.data);
                    setError("Invalid data format received from the server");
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching inventory:", error);
                setError("Failed to connect to the inventory server");
                setLoading(false);
            }
        };

        fetchInventory();
    }, []);

    useEffect(() => {
        if (!searchSubmitted || !searchTerm || !inventory || inventory.length === 0) return;

        const normalizeText = (text) => {
            return text
                .toLowerCase()
                .replace(/\s*-\s*/g, '') // Remove hyphens and surrounding spaces
                .replace(/(\d+)\s+([a-z]+)/g, '$1$2') // Join numbers with their units (e.g., "3 way" -> "3way")
                .replace(/\s+/g, ' ') // Replace multiple spaces with single space
                .replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, '') // Remove punctuation but keep letters for fuzzy matching
                .replace(/ml/gi, 'ml') // Normalize ml/mL variations
                .replace(/mg/gi, 'mg') // Normalize mg/mG variations
                .trim();
        };

        // Function to calculate similarity between two strings
        const calculateSimilarity = (str1, str2) => {
            const len1 = str1.length;
            const len2 = str2.length;
            const matrix = Array(len1 + 1).fill().map(() => Array(len2 + 1).fill(0));

            for (let i = 0; i <= len1; i++) matrix[i][0] = i;
            for (let j = 0; j <= len2; j++) matrix[0][j] = j;

            for (let i = 1; i <= len1; i++) {
                for (let j = 1; j <= len2; j++) {
                    const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j] + 1, // deletion
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j - 1] + cost // substitution
                    );
                }
            }
            return 1 - matrix[len1][len2] / Math.max(len1, len2);
        };

        const SIMILARITY_THRESHOLD = 0.5; // Same threshold as suggestions
        const term = normalizeText(searchTerm);
        let result = null;
        let bestMatch = null;
        let bestSimilarity = 0;

        // Search through all drawers and compartments using labeled loop
        searchLoop: for (const drawer of inventory) {
            if (drawer?.compartments?.length) {
                for (const compartment of drawer.compartments) {
                    if (compartment?.item) {
                        const normalizedItem = normalizeText(compartment.item);
                        const itemWords = normalizedItem.split(' ');
                        const searchWords = term.split(' ');
                        
                        // Check each search word against each item word
                        let allWordsMatch = true;
                        let totalSimilarity = 0;
                        let matchedWords = 0;

                        for (const searchWord of searchWords) {
                            if (searchWord.trim() === '') continue;
                            
                            let wordMatched = false;
                            let bestWordSimilarity = 0;

                            for (const itemWord of itemWords) {
                                // Try direct substring match first
                                if (itemWord.includes(searchWord)) {
                                    wordMatched = true;
                                    bestWordSimilarity = 1;
                                    break;
                                }
                                
                                // Try fuzzy matching
                                const similarity = calculateSimilarity(itemWord, searchWord);
                                if (similarity > bestWordSimilarity) {
                                    bestWordSimilarity = similarity;
                                }
                                if (similarity >= SIMILARITY_THRESHOLD) {
                                    wordMatched = true;
                                }
                            }

                            if (!wordMatched) {
                                allWordsMatch = false;
                                break;
                            }
                            totalSimilarity += bestWordSimilarity;
                            matchedWords++;
                        }

                        if (allWordsMatch && matchedWords > 0) {
                            const avgSimilarity = totalSimilarity / matchedWords;
                            if (avgSimilarity > bestSimilarity) {
                                bestSimilarity = avgSimilarity;
                                bestMatch = {
                                    drawer: drawer.drawer,
                                    compartment: compartment.compartment,
                                    item: compartment.item,
                                    count: compartment.count,
                                    image: compartment.image,
                                    audio: compartment.audio,
                                    similarity: avgSimilarity
                                };
                                if (avgSimilarity === 1) {
                                    result = bestMatch;
                                    break searchLoop;
                                }
                            }
                        }
                    }
                }
            }
        }

        // Use the best fuzzy match if no exact match was found
        if (!result && bestMatch) {
            result = bestMatch;
        }

        if (!result) {
            alert(`ERROR: No item found matching "${searchTerm}"`);
        }

        setSearchResult(result);
        setSearchSubmitted(false);
        setSearchTerm('');

        if (result) {
            import(`../../assets/images-v1/crash-cart-d${result.drawer}.png`)
                .then((module) => setDrawerImageSrc(module.default))
                .catch((err) => {
                    console.error('Error loading image:', err);
                    setDrawerImageSrc('');
                });
        }
    }, [searchSubmitted, inventory]);

    useEffect(() => {
        if (searchResult && searchResult.audio) {
            console.log('Audio path:', searchResult.audio);
            // wait for audio to mount before playing
            setTimeout(() => {
                if (audioRef.current) {
                    console.log('Audio ready, attempting to play');
                    audioRef.current.muted = audioMuted;
                    audioRef.current.currentTime = 0;
                    audioRef.current.play()
                        .then(() => console.log('Audio playing successfully'))
                        .catch(error => console.error('Error playing audio:', error));
                } else {
                    console.log('Audio not found');
                }
            }, 100);
        }
    }, [searchResult]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = audioMuted;
        }
    }, [audioMuted]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchSubmitted(true);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const clearSearch = () => {
        setSearchTerm('');
        setSearchResult(null);
        setDrawerImageSrc('');
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const refreshPage = () => {
        setLoading(true);
        setSearchTerm('');
        setSearchResult(null);
        setError(null);
        setDrawerImageSrc('');

        axios.get('http://localhost:8080/api/data')
            .then(response => {
                if (response.data && response.data.inventory) {
                    setInventory(response.data.inventory);
                } else {
                    console.error("Invalid inventory data format:", response.data);
                    setError("Invalid data format received from the server");
                }
                setLoading(false);
            })
            .catch(error => {
                console.error("Error refreshing inventory:", error);
                setError("Failed to refresh inventory data");
                setLoading(false);
            });
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim() === '') {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        // Only show suggestions if there are at least 2 characters
        if (value.trim().length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const normalizeText = (text) => {
            return text
                .toLowerCase()
                .replace(/\s*-\s*/g, '') // Remove hyphens and surrounding spaces
                .replace(/(\d+)\s+([a-z]+)/g, '$1$2') // Join numbers with their units
                .replace(/\s+/g, ' ') // Replace multiple spaces with single space
                .replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, '') // Remove punctuation
                .replace(/ml/gi, 'ml') // Normalize ml/mL variations
                .replace(/mg/gi, 'mg') // Normalize mg/mG variations
                .trim();
        };

        const calculateSimilarity = (str1, str2) => {
            const len1 = str1.length;
            const len2 = str2.length;
            const matrix = Array(len1 + 1).fill().map(() => Array(len2 + 1).fill(0));

            for (let i = 0; i <= len1; i++) matrix[i][0] = i;
            for (let j = 0; j <= len2; j++) matrix[0][j] = j;

            for (let i = 1; i <= len1; i++) {
                for (let j = 1; j <= len2; j++) {
                    const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j - 1] + cost
                    );
                }
            }
            return 1 - matrix[len1][len2] / Math.max(len1, len2);
        };

        const SIMILARITY_THRESHOLD = 0.5; // More lenient threshold for word-by-word matching
        const term = normalizeText(value);
        const suggestions = [];

        inventory.forEach(drawer => {
            if (drawer.compartments && Array.isArray(drawer.compartments)) {
                drawer.compartments.forEach(compartment => {
                    if (compartment.item) {
                        const normalizedItem = normalizeText(compartment.item);
                        const itemWords = normalizedItem.split(' ');
                        const searchWords = term.split(' ');
                        
                        // Check each search word against each item word
                        let allWordsMatch = true;
                        let bestWordSimilarity = 0;

                        for (const searchWord of searchWords) {
                            if (searchWord.trim() === '') continue;
                            
                            let wordMatched = false;
                            let bestSimilarityForWord = 0;

                            for (const itemWord of itemWords) {
                                // Check for direct substring match first
                                if (itemWord.includes(searchWord)) {
                                    wordMatched = true;
                                    bestSimilarityForWord = 1;
                                    break;
                                }
                                
                                // Try fuzzy matching
                                const wordSimilarity = calculateSimilarity(itemWord, searchWord);
                                bestSimilarityForWord = Math.max(bestSimilarityForWord, wordSimilarity);
                                if (wordSimilarity >= SIMILARITY_THRESHOLD) {
                                    wordMatched = true;
                                    break;
                                }
                            }

                            if (!wordMatched) {
                                allWordsMatch = false;
                                break;
                            }
                            bestWordSimilarity += bestSimilarityForWord;
                        }

                        if (allWordsMatch) {
                            // Average similarity across all matched words
                            const avgSimilarity = bestWordSimilarity / searchWords.filter(w => w.trim() !== '').length;
                            suggestions.push({
                                item: compartment.item,
                                similarity: avgSimilarity
                            });
                        }
                    }
                });
            }
        });

        // Sort by similarity (highest first) and take top 5 matches
        suggestions.sort((a, b) => b.similarity - a.similarity);
        setSuggestions(suggestions.slice(0, 5).map(s => s.item));
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        setSuggestions([]);
        setShowSuggestions(false);
        setSearchSubmitted(true);
    };

    const handleAudioToggle = () => {
        setAudioMuted((prev) => !prev);
    };

    return (
        <div className="item-locator-container">
            <div className="search-container">
                <form onSubmit={handleSearch} className="search-form">
                    <div className="input-wrapper">
                        <input
                            type="text"
                            placeholder="Search for item..."
                            value={searchTerm}
                            onChange={handleInputChange}
                            onFocus={() => setShowSuggestions(true)}
                        />
                        {searchTerm && (
                            <img 
                                src={closeIcon} 
                                alt="Clear search"
                                className="clear-icon" 
                                onClick={clearSearch}
                            />
                        )}
                    </div>
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="suggestions-list">
                            {suggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className="suggestion-item"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion}
                                </div>
                            ))}
                        </div>
                    )}
                </form>
                <div className="audio-toggle">
                    <Switch checked={!audioMuted} onChange={handleAudioToggle} color="primary" />
                    {audioMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </div>
            </div>

            {searchResult && (
                <div className="results-header">
                    <p className="item-name">{searchResult.item} (Quantity: {searchResult.count})</p>
                    <button className="refresh-button" onClick={refreshPage}>
                        <img src={RefreshIcon} alt="Refresh" className="refresh-icon" />
                    </button>
                </div>
            )}

            <div className="results-section">
                <div className="results-container">
                    {loading ? (
                        <div className="loading">Loading inventory...</div>
                    ) : error ? (
                        <div className="error-message">
                            <p>{error}</p>
                            <button onClick={refreshPage}>Try Again</button>
                        </div>
                    ) : searchResult ? (
                        <div className="result-display">
                            <div className="image-container">
                                <img
                                    src={drawerImageSrc || crashCartImage}
                                    alt={`Drawer ${searchResult.drawer}`}
                                />
                            </div>
                            <div className="popup">
                                <div className="popup__content">
                                    <img className="close-btn" src={closeIcon} onClick={clearSearch} />
                                    <p className="popup__content__text">Drawer {searchResult.drawer}</p>
                                    <hr />
                                    <p className="popup__content__text">Compartment {searchResult.compartment}</p>
                                </div>
                            </div>
                            {searchResult.audio && (
                                <audio
                                    ref={audioRef}
                                    src={searchResult.audio}
                                    style={{ display: 'none' }}
                                    key={searchResult.audio} // re-mount on new audio
                                    onLoadedData={() => console.log('Audio loaded:', searchResult.audio)}
                                    onError={(e) => console.error('Audio loading error:', e.target.error)}
                                    preload="auto"
                                />
                            )}
                        </div>
                    ) : (
                        <div className="default-image">
                            <img
                                src={crashCartImage}
                                alt="Crash Cart"
                            />
                        </div>
                    )}
                </div>

                {searchResult && searchResult.image && (
                    <div className="item-popup">
                        <div className="item-popup__content">
                            <img
                                src={searchResult.image}
                                alt={searchResult.item}
                                className="item-image"
                            />
                            <p className="item-popup__text">{searchResult.item}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};