import "./App.css";
import Cam from "@/components/Cam";

function App() {
  return (
    <main className="mx-auto flex flex-col items-center gap-12">
      <div
        style={{
          backgroundImage: "url('/content-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
          width: "100%",
          height: "100vh",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <div className="w-16 absolute top-30 right-0">
        <img src="/anon.png" alt="Anon" />
      </div>

      <div className="w-16 absolute top-86 left-0">
        <img src="/soyo.png" alt="Soyo" />
      </div>

      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-pink-400 via-rose-500 to-orange-400 text-transparent bg-clip-text">
          Oshitabi Cam
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          与你最爱的角色合影留念，创造属于你的“推し旅”回忆！
        </p>
      </header>

      {/* 快速上手指南 */}
      <section className="w-full mb-6 max-w-md p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-gray-100">
          三步快速上手
        </h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-4xl mb-2">🎨</div>
            <p className="font-semibold text-gray-700 dark:text-gray-200">
              1. 选择
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              挑选角色与相框
            </p>
          </div>
          <div>
            <div className="text-4xl mb-2">👆</div>
            <p className="font-semibold text-gray-700 dark:text-gray-200">
              2. 调整
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              拖动调整位置
            </p>
          </div>
          <div>
            <div className="text-4xl mb-2">📸</div>
            <p className="font-semibold text-gray-700 dark:text-gray-200">
              3. 拍照
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              点击下方快门
            </p>
          </div>
        </div>
      </section>

      {/* 相机主组件 */}
      <Cam />

      <footer className="text-center text-sm text-gray-500">
        <p>
          灵感来源于{" "}
          <a
            href="https://recommend.jr-central.co.jp/oshi-tabi/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-700 dark:hover:text-gray-300"
          >
            JR東海【推し旅】
          </a>
          官方活动.
        </p>
        <p className="mt-2">
          祝你玩得开心！by：
          <a
            href="https://space.bilibili.com/259486090"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-700 dark:hover:text-gray-300"
          >
            @Chilfish
          </a>
          ，
          <a
            href="https://github.com/Chilfish/oshitabi"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-700 dark:hover:text-gray-300"
          >
            Github
          </a>
        </p>
      </footer>
    </main>
  );
}

export default App;
