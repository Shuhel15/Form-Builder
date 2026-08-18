import FadeIn from "../animations/FadeIn";

export default function WhyFormBuilder() {
  return (
    <FadeIn>
    <section id="why" className="relative mt-30 px-4 md:px-6">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <p className="border-b border-pink-600 text-lg font-semibold text-pink-600">
          WHY FORM BUILDER ?
        </p>

        <h2 className="mt-4 w-full text-center text-5xl font-extrabold text-black">
          Create forms. Keep it simple.
        </h2>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          Form Builder gives you everything you need to create professional
          forms, share them with anyone, and manage responses from one simple
          place.
        </p>

        <p className="mt-4 max-w-2xl text-gray-500">
          Whether you are collecting feedback, managing registrations, or
          gathering important information, keep everything simple and organized.
        </p>
      </div>
    </section>
    </FadeIn>
  );
}
