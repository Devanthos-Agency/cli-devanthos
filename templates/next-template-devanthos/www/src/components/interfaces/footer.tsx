import { createLucideIcon } from 'lucide-react';
import React from 'react';

// lucide 1.x eliminó los íconos de marca; se recrean con los paths originales de lucide 0.x
const Instagram = createLucideIcon('instagram', [
    ['rect', { width: '20', height: '20', x: '2', y: '2', rx: '5', ry: '5', key: '1' }],
    ['path', { d: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z', key: '2' }],
    ['line', { x1: '17.5', x2: '17.51', y1: '6.5', y2: '6.5', key: '3' }],
]);
const Facebook = createLucideIcon('facebook', [
    ['path', { d: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z', key: '1' }],
]);
const Twitter = createLucideIcon('twitter', [
    ['path', { d: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z', key: '1' }],
]);
const Linkedin = createLucideIcon('linkedin', [
    ['path', { d: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z', key: '1' }],
    ['rect', { width: '4', height: '12', x: '2', y: '9', key: '2' }],
    ['circle', { cx: '4', cy: '4', r: '2', key: '3' }],
]);

interface Footer7Props {
    logo?: {
        url: string;
        src: string;
        alt: string;
        title: string;
    };
    sections?: Array<{
        title: string;
        links: Array<{ name: string; href: string }>;
    }>;
    description?: string;
    socialLinks?: Array<{
        icon: React.ReactElement;
        href: string;
        label: string;
    }>;
    copyright?: string;
    legalLinks?: Array<{
        name: string;
        href: string;
    }>;
}

const defaultSections = [
    {
        title: 'Product',
        links: [
            { name: 'Overview', href: '#' },
            { name: 'Pricing', href: '#' },
            { name: 'Marketplace', href: '#' },
            { name: 'Features', href: '#' },
        ],
    },
    {
        title: 'Company',
        links: [
            { name: 'About', href: '#' },
            { name: 'Team', href: '#' },
            { name: 'Blog', href: '#' },
            { name: 'Careers', href: '#' },
        ],
    },
    {
        title: 'Resources',
        links: [
            { name: 'Help', href: '#' },
            { name: 'Sales', href: '#' },
            { name: 'Advertise', href: '#' },
            { name: 'Privacy', href: '#' },
        ],
    },
];

const defaultSocialLinks = [
    { icon: <Instagram className="size-5" />, href: '#', label: 'Instagram' },
    { icon: <Facebook className="size-5" />, href: '#', label: 'Facebook' },
    { icon: <Twitter className="size-5" />, href: '#', label: 'Twitter' },
    { icon: <Linkedin className="size-5" />, href: '#', label: 'LinkedIn' },
];

const defaultLegalLinks = [
    { name: 'Terms and Conditions', href: '#' },
    { name: 'Privacy Policy', href: '#' },
];

const Footer = ({
    logo = {
        url: '#',
        src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg',
        alt: 'logo',
        title: 'Shadcnblocks.com',
    },
    sections = defaultSections,
    description = 'A collection of components for your startup business or side project.',
    socialLinks = defaultSocialLinks,
    copyright = '© 2024 All rights reserved.',
    legalLinks = defaultLegalLinks,
}: Footer7Props) => {
    return (
        <section className="py-32">
            <div className="container mx-auto">
                <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
                    <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
                        {/* Logo */}
                        <div className="flex items-center gap-2 lg:justify-start">
                            <a href={logo.url}>
                                <img
                                    src={logo.src}
                                    alt={logo.alt}
                                    title={logo.title}
                                    className="h-8"
                                />
                            </a>
                        </div>
                        <p className="text-muted-foreground max-w-[70%] text-sm">{description}</p>
                        <ul className="text-muted-foreground flex items-center space-x-6">
                            {socialLinks.map((social, idx) => (
                                <li key={idx} className="hover:text-primary font-medium">
                                    <a href={social.href} aria-label={social.label}>
                                        {social.icon}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="grid w-full gap-6 md:grid-cols-3 lg:gap-20">
                        {sections.map((section, sectionIdx) => (
                            <div key={sectionIdx}>
                                <h3 className="mb-4 font-bold">{section.title}</h3>
                                <ul className="text-muted-foreground space-y-3 text-sm">
                                    {section.links.map((link, linkIdx) => (
                                        <li
                                            key={linkIdx}
                                            className="hover:text-primary font-medium">
                                            <a href={link.href}>{link.name}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="text-muted-foreground mt-8 flex flex-col justify-between gap-4 border-t py-8 text-xs font-medium md:flex-row md:items-center md:text-left">
                    <p className="order-2 lg:order-1">{copyright}</p>
                    <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row">
                        {legalLinks.map((link, idx) => (
                            <li key={idx} className="hover:text-primary">
                                <a href={link.href}> {link.name}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export { Footer };
