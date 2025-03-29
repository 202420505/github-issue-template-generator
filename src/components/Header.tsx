import logoImage from './../images/logo.svg'

export default function Header() {
    return (
        <header class="bg-[#f6f8fa] border-b h-16 border-b-[#d1d9e0] dark:bg-[#010409] dark:border-b-[#3d444d] dark:text-white w-full">
            <nav class="px-4 mx-auto max-w-[1400px] flex justify-between items-center h-full">
                <a href="/" class="font-bold flex items-center gap-2">
                    <img src={logoImage} width={45} height={45}/>
                    <p>GitHub Issue Template Generator</p>
                </a>

                <a target='_blank' href="https://github.com/happer64bit/github-issue-template-generator" class="text-sm">Source Code</a>
            </nav>
        </header>
    )
}